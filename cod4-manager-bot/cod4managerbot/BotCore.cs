using Humanizer;
using LiteDB;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using Telegram.Bot;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
//using Telegram.Bot.Types.InlineKeyboardButtons;
using Telegram.Bot.Types.ReplyMarkups;

namespace Cod4managerbot
{
    public static class BotCore
    {
        private static readonly TelegramBotClient _bot = Constants.GetTelegramBotClient;
        private static long _adminTgId = Convert.ToInt64(Constants.GetDictConfigData["adminTgId"]);
        public static DateTime BotStartDateTime = DateTime.MaxValue;
        public static DateTime LastMessage { get; set; }

        public static async Task<Message> SafeSendTextMessageAsync(ChatId chatId, string text, bool disableWebPagePreview = true,
                                                                   bool disableNotification = false, int replyToMessageId = 0,
                                                                   IReplyMarkup replyMarkup = null, ParseMode parseMode = ParseMode.Default)
        {
            try
            {
                var message = await _bot.SendTextMessageAsync(chatId, text, parseMode, disableWebPagePreview,
                                                                disableNotification, replyToMessageId, replyMarkup);
                return message;
            }
            catch (Exception)
            {
                //ex.ToString().Error();
                return null;
            }
        }

        public static async Task<Message> SafeEditTextMessageAsync(ChatId chatId, int messageId, string text,
                                                                   ParseMode parseMode = ParseMode.Default, bool disableWebPagePreview = true,
                                                                   InlineKeyboardMarkup replyMarkup = null)
        {
            try
            {
                var message = await _bot.EditMessageTextAsync(chatId, messageId, text, parseMode,
                                                              disableWebPagePreview, replyMarkup);
                return message;
            }
            catch (Exception)
            {
                //ex.ToString().Error();
                return null;
            }
        }

        public static async Task<Message> SafeSendOrEditTextMessageAsync(bool mustEditMess, ChatId chatId, int messageId, string text, bool disableWebPagePreview = true,
                                                                   bool disableNotification = false, int replyToMessageId = 0,
                                                                   InlineKeyboardMarkup replyMarkup = null, ParseMode parseMode = ParseMode.Default)
        {
            try
            {
                var message = mustEditMess ? (await SafeEditTextMessageAsync(chatId, messageId, text, replyMarkup: replyMarkup, parseMode: parseMode, disableWebPagePreview: disableWebPagePreview)) :
                                    (await SafeSendTextMessageAsync(chatId, text, replyMarkup: replyMarkup, parseMode: parseMode, disableWebPagePreview: disableWebPagePreview, disableNotification: disableNotification));
                return message;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public static string GetArg(string message, List<string> initMessPossibilities)
        {
            try
            {
                if (initMessPossibilities == null || message == null ||
                    message.Trim() == "" || initMessPossibilities.Count == 0)
                    return "";
                var mess = message.ToLower().Trim();
                for (int i = 0; i < initMessPossibilities.Count; i++)
                {
                    if (mess.StartsWith(initMessPossibilities[i].ToLower().Trim()))
                    {
                        return mess.Remove(0, initMessPossibilities[i].Length).Trim();
                    }
                    if (mess.StartsWith($"/{initMessPossibilities[i].ToLower().Trim()}"))
                    {
                        return mess.Remove(0, $"/{initMessPossibilities[i].ToLower().Trim()}".Length).Trim();
                    }
                }
                return "";
            }
            catch (Exception)
            {
                return "";
            }
        }

        public static bool IsMessStartingWith(string mess, string initMess)
        {
            if (string.IsNullOrEmpty(mess) || string.IsNullOrEmpty(initMess))
                return false;
            var cp = false;
            var m = mess.ToLower().Trim();
            var i = initMess.ToLower().Trim();
            cp = m.StartsWith(i) || m.StartsWith($"/{i}");
            return cp;
        }

        public static string GetUserInfo(Models.User user)
        {
            var r = "";
            var now = DateTime.Now;
            r += $"Id: {user.Id}\n";
            r += $"Username: {user.Username}\n";
            r += $"Allowed: {user.Allowed}\n";
            r += $"Name: {user.FirstName}\n";
            r += $"Lastname: {user.LastName}\n";
            r += $"Creation date: {user.CreationDate}\n";
            r += $"({(now - user.CreationDate).Humanize(2)})\n";
            r += $"Status: {user.Status}\n";
            r += $"Message counter: {user.MessagesCounter}\n";
            r += $"Last message: {user.LastMessage}\n";
            r += $"({(now - user.LastMessage).Humanize(2)})";
            return r;
        }

        public static string GetBotInfo()
        {
            var _users = Constants.GetDbUsers;
            var r = "";
            var now = DateTime.Now;
            r += $"Start time: {BotStartDateTime.ToLocalTime()}\n";
            r += $"({(now - BotStartDateTime.ToLocalTime()).Humanize(2)})\n";
            r += $"Last message: {LastMessage}\n";
            r += $"({(now - LastMessage).Humanize(2)})\n";
            r += $"Total users/groups: {_users.LongCount()}\n";
            r += $"Total users: {_users.Count(x => x.Id >= 0)}\n";
            r += $"Total groups: {_users.Count(x => x.Id < 0)}\n";
            r += $"Total users/groups allowed: {_users.Count(x => x.Allowed == true)}\n";
            r += $"Total users allowed: {_users.Count(x => x.Id >= 0 && x.Allowed == true)}\n";
            r += $"Total groups allowed: {_users.Count(x => x.Id < 0 && x.Allowed == true)}";
            return r;
        }

        //example: Add||add;tellActive||tellactive,tellWaiting||tellwaiting,tellStopped||tellstopped;Info||info
        public static InlineKeyboardMarkup CreateInlineKeyboard(string buttonsInlineDesc)
        {
            try
            {
                var keyboard = new InlineKeyboardMarkup(new InlineKeyboardButton[1][]);
                List<List<string>> inlineButtons = new List<List<string>>();

                if (String.IsNullOrEmpty(buttonsInlineDesc)) return keyboard;
                var tempArray = buttonsInlineDesc.Split(new string[] { ";" }, StringSplitOptions.RemoveEmptyEntries);
                for (int i = 0; i < tempArray.Length; i++)
                {
                    var tList = tempArray[i].Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries).ToList();
                    inlineButtons.Add(tList);
                }

                if (inlineButtons == null) return keyboard;
                if (inlineButtons.Count == 0) return keyboard;

                if (inlineButtons.Count == 1)
                {
                    var rowCells = inlineButtons[0];
                    if (rowCells != null && rowCells.Count > 0)
                    {
                        List<InlineKeyboardButton> keyboardButtons = new List<InlineKeyboardButton>();
                        for (int i = 0; i < rowCells.Count; i++)
                        {
                            var cellContent = rowCells[i].Split(new string[] { Constants.SEPARATION }, StringSplitOptions.RemoveEmptyEntries);
                            var text = cellContent[0];
                            var callbackData = cellContent[1];
                            keyboardButtons.Add(InlineKeyboardButton.WithCallbackData(text, callbackData));
                        }
                        keyboard = new InlineKeyboardMarkup(
                            new[]
                            {
                                keyboardButtons.ToArray()
                            });
                        return keyboard;
                    }
                    else return new InlineKeyboardMarkup(new InlineKeyboardButton[1][]);
                }
                else
                {
                    List<List<InlineKeyboardButton>> allButtons = new List<List<InlineKeyboardButton>>();
                    for (int i = 0; i < inlineButtons.Count; i++)
                    {
                        var rowCells = inlineButtons[i];
                        if (rowCells != null && rowCells.Count > 0)
                        {
                            List<InlineKeyboardButton> keyboardButtons = new List<InlineKeyboardButton>();
                            for (int j = 0; j < rowCells.Count; j++)
                            {
                                var cellContent = rowCells[j].Split(new string[] { Constants.SEPARATION }, StringSplitOptions.RemoveEmptyEntries);
                                var text = cellContent[0];
                                var callbackData = cellContent[1];
                                keyboardButtons.Add(InlineKeyboardButton.WithCallbackData(text, callbackData));
                            }
                            allButtons.Add(keyboardButtons);
                        }
                    }

                    InlineKeyboardButton[][] allButtonsArray = new InlineKeyboardButton[allButtons.Count][];
                    for (int i = 0; i < allButtons.Count; i++)
                    {
                        allButtonsArray[i] = allButtons[i].ToArray();
                    }
                    keyboard = new InlineKeyboardMarkup(allButtonsArray);
                    return keyboard;
                }
            }
            catch (Exception)
            {
                return new InlineKeyboardMarkup(new InlineKeyboardButton[1][]);
            }
        }

        //example: Add;tellActive,tellWaiting,tellStopped;Info
        public static ReplyKeyboardMarkup CreateReplyKeyboard(string buttonsInlineDesc)
        {
            try
            {
                var keyboard = new ReplyKeyboardMarkup();
                List<List<string>> keyboardButtonsList = new List<List<string>>();

                if (String.IsNullOrEmpty(buttonsInlineDesc)) return keyboard;
                var tempArray = buttonsInlineDesc.Split(new string[] { ";" }, StringSplitOptions.RemoveEmptyEntries);
                for (int i = 0; i < tempArray.Length; i++)
                {
                    var tList = tempArray[i].Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries).ToList();
                    keyboardButtonsList.Add(tList);
                }

                if (keyboardButtonsList == null) return keyboard;
                if (keyboardButtonsList.Count == 0) return keyboard;

                if (keyboardButtonsList.Count == 1)
                {
                    var rowCells = keyboardButtonsList[0];
                    if (rowCells != null && rowCells.Count > 0)
                    {
                        List<KeyboardButton> keyboardButtons = new List<KeyboardButton>();
                        for (int i = 0; i < rowCells.Count; i++)
                        {
                            var cellContent = rowCells[i];
                            keyboardButtons.Add(new KeyboardButton(cellContent));
                        }
                        keyboard = new ReplyKeyboardMarkup(
                            new[]
                            {
                                keyboardButtons.ToArray()
                            }, resizeKeyboard: true);
                        return keyboard;
                    }
                    else return new ReplyKeyboardMarkup();
                }
                else
                {
                    List<List<KeyboardButton>> allButtons = new List<List<KeyboardButton>>();
                    for (int i = 0; i < keyboardButtonsList.Count; i++)
                    {
                        var rowCells = keyboardButtonsList[i];
                        if (rowCells != null && rowCells.Count > 0)
                        {
                            List<KeyboardButton> keyboardButtons = new List<KeyboardButton>();
                            for (int j = 0; j < rowCells.Count; j++)
                            {
                                var cellContent = rowCells[j];
                                keyboardButtons.Add(new KeyboardButton(cellContent));
                            }
                            allButtons.Add(keyboardButtons);
                        }
                    }

                    KeyboardButton[][] allButtonsArray = new KeyboardButton[allButtons.Count][];
                    for (int i = 0; i < allButtons.Count; i++)
                    {
                        allButtonsArray[i] = allButtons[i].ToArray();
                    }
                    keyboard = new ReplyKeyboardMarkup(allButtonsArray, resizeKeyboard: true);
                    return keyboard;
                }
            }
            catch (Exception)
            {
                return new ReplyKeyboardMarkup();
            }
        }

        public static string SanitizeMarkdown(string text)
        {
            if (String.IsNullOrEmpty(text)) return "";
            return text.Replace("_", "-").Replace("*", ".").Replace("`", ".");
        }

        public static Models.User GetAndUpdateUser(long idUser, Message message)
        {
            var _users = Constants.GetDbUsers;
            Models.User user = _users.FindOne(x => x.Id == idUser);
            if (user == null)
            {
                var now = DateTime.Now;
                user = new Models.User()
                {
                    FirstName = message.Chat.FirstName,
                    Id = idUser,
                    LastName = message.Chat.LastName,
                    Status = "main",
                    Username = message.Chat.Username,
                    CreationDate = now,
                    LastMessage = now,
                    MessagesCounter = 0,
                    Allowed = false
                };
                _users.Insert(user);
            }

            //updating data user
            if (user.FirstName != message.Chat.FirstName)
            {
                user.FirstName = message.Chat.FirstName;
            }
            if (user.LastName != message.Chat.LastName)
            {
                user.LastName = message.Chat.LastName;
            }
            if (user.Username != message.Chat.Username)
            {
                user.Username = message.Chat.Username;
            }
            user.LastMessage = DateTime.Now;
            user.MessagesCounter += 1;

            _users.Update(user);

            if (idUser != _adminTgId)
            {
                LastMessage = DateTime.Now;
            }
            _users = null;
            return user;
        }

        public static void SetUserStatus(Models.User user, string newStatus)
        {
            if (user.Status != newStatus)
            {
                user.Status = newStatus;
                Constants.GetDbUsers.Update(user);
            }
        }
    }
}
