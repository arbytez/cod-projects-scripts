using LiteDB;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using Telegram.Bot;
using Telegram.Bot.Args;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Unosquare.Swan;
using Telegram.Bot.Types.InlineQueryResults;
//using Telegram.Bot.Types.InputMessageContents;
using Telegram.Bot.Types.ReplyMarkups;
using System.Threading;
using System.Net.Sockets;
using System.Text;
using System.Net;
using Renci.SshNet;
using System.IO;
using System.Text.RegularExpressions;

// Example:
// https://github.com/MrRoundRobin/telegram.bot.examples/blob/master/Telegram.Bot.Examples.Echo/Program.cs

//sendcommand - send rcon commands
//stopsendcommand - stop to send rcon commands
//offban - offban a player by name or player id
//offtempban - offtempban a player by name or player id
//help - print this message

namespace Cod4managerbot
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                var runBot = new RunBot();
                runBot.Run();
            }
            catch (Exception ex)
            {
                ex.ToString().Error();
            }
        }

        public class RunBot
        {
            private static TelegramBotClient _bot = null;
            private static string _botName;
            private string _botToken;
            private static long _adminTgId = -1;
            private BackgroundWorker _bw = null;
            private Rcon _rcon = null;
            private struct PlayerEnterLeaveInfos
            {
                public string name;
                public string ip;
                public string date;
                public string id;
            };

            public RunBot()
            {
                _botToken = Constants.GetConfigParValue("botToken");
                _adminTgId = Convert.ToInt64(Constants.GetConfigParValue("adminTgId"));
                _bot = Constants.GetTelegramBotClient;
                _bw = new BackgroundWorker();
                _rcon = new Rcon(Constants.COD4SERVER, Constants.COD4PORT, Constants.COD4RCON);
            }

            public void Run()
            {
                try
                {
                    $"Starting...".Info();
                    _bot.OnCallbackQuery += BotOnCallbackQueryReceived;
                    _bot.OnMessage += BotOnMessageReceived;
                    _bot.OnMessageEdited += BotOnMessageReceived;
                    _bot.OnInlineQuery += BotOnInlineQueryReceived;
                    _bot.OnInlineResultChosen += BotOnChosenInlineResultReceived;
                    _bot.OnReceiveError += BotOnReceiveError;

                    var me = _bot.GetMeAsync().Result;

                    Console.Title = me.Username;

                    _botName = $"@{me.Username}";

                    _bot.StartReceiving();
                    $"Bot {me.Username} is receiving data...".Info();
                    BotCore.SafeSendTextMessageAsync(_adminTgId, "Started!").Wait();
                    BotCore.BotStartDateTime = DateTime.UtcNow;
                    BotCore.LastMessage = DateTime.Now;

                    //Console.ReadLine();
                    while (true)
                    {
                        Task.Delay(10000).Wait();
                    }

                    //$"Stopping bot...".Info();
                    //_bot.StopReceiving();
                    //Constants.GetLiteDatabase.Dispose();
                    //Task.Delay(1000).Wait();
                    //$"Program terminated.".Info();
                    //Task.Delay(1000).Wait();
                }
                catch (Exception ex)
                {
                    ex.ToString().Error();
                }
            }

            private static void BotOnReceiveError(object sender, ReceiveErrorEventArgs receiveErrorEventArgs)
            {
                try
                {
                    Debugger.Break();
                }
                catch (Exception ex)
                {
                    ex.ToString().Error();
                }
            }

            private static async void BotOnChosenInlineResultReceived(object sender, ChosenInlineResultEventArgs chosenInlineResultEventArgs)
            {
                try
                {
                    await BotCore.SafeSendTextMessageAsync(_adminTgId, $"{Constants.EMOJIWARNING} BotOnChosenInlineResultReceived!");
                    Console.WriteLine($"Received choosen inline result: {chosenInlineResultEventArgs.ChosenInlineResult.ResultId}");
                }
                catch (Exception ex)
                {
                    ex.ToString().Error();
                }
            }

            private static async void BotOnInlineQueryReceived(object sender, InlineQueryEventArgs inlineQueryEventArgs)
            {
                try
                {
                    await BotCore.SafeSendTextMessageAsync(_adminTgId, $"{Constants.EMOJIWARNING} BotOnInlineQueryReceived!");
                    //InlineQueryResult[] results =
                    //{
                    //    new InlineQueryResultLocation
                    //    {
                    //        Id = "1",
                    //        Latitude = 40.7058316f, // displayed result
                    //        Longitude = -74.2581888f,
                    //        Title = "New York",
                    //        InputMessageContent = new InputLocationMessageContent // message if result is selected
                    //        {
                    //            Latitude = 40.7058316f,
                    //            Longitude = -74.2581888f,
                    //        }
                    //    },

                    //    new InlineQueryResultLocation
                    //    {
                    //        Id = "2",
                    //        Longitude = 52.507629f, // displayed result
                    //        Latitude = 13.1449577f,
                    //        Title = "Berlin",
                    //        InputMessageContent = new InputLocationMessageContent // message if result is selected
                    //        {
                    //            Longitude = 52.507629f,
                    //            Latitude = 13.1449577f
                    //        }
                    //    }
                    //};

                    //await _bot.AnswerInlineQueryAsync(inlineQueryEventArgs.InlineQuery.Id, results, isPersonal: true, cacheTime: 0);
                }
                catch (Exception ex)
                {
                    ex.ToString().Error();
                }
            }

            private async void BotOnMessageReceived(object sender, MessageEventArgs messageEventArgs)
            {
                try
                {
                    var message = messageEventArgs.Message;
                    await BotCoreLogic(message, message.Text);
                }
                catch (Exception ex)
                {
                    ex.ToString().Error();
                }
            }

            private async void BotOnCallbackQueryReceived(object sender, CallbackQueryEventArgs callbackQueryEventArgs)
            {
                try
                {
                    var callbackId = callbackQueryEventArgs.CallbackQuery.Id;
                    var callbackData = callbackQueryEventArgs.CallbackQuery.Data;
                    var message = callbackQueryEventArgs.CallbackQuery.Message;
                    await BotCoreLogic(message, callbackData, true);
                }
                catch (Exception ex)
                {
                    ex.ToString().Error();
                }
            }

            private async Task BotCoreLogic(Message message, string text, bool mustEditMess = false)
            {
                try
                {
                    if (message.Date < BotCore.BotStartDateTime) return;
                    if (message == null) return;
                    var chatId = Convert.ToInt64(message.Chat.Id);
                    //if (chatId != _adminTgId) return; //filter
                    var messageId = message.MessageId;

                    Models.User user = BotCore.GetAndUpdateUser(chatId, message);

                    if (chatId != Constants.AdminTgId)
                    {
                        if (!user.Allowed && !BotCore.IsMessStartingWith(text, "sendid"))
                        {
                            $"Received TextMessage [{message.Text}] from a not allowed user id [{chatId}]".Warn();
                            return;
                        }
                    }

                    if (text.Length == 0) return;
                    //deleting the right part after symbol @
                    text = text.Replace(_botName, String.Empty);

                    $"Received TextMessage [{message.Text}] from user id [{chatId}]".Debug();

                    //await _bot.SendChatActionAsync(chatId, ChatAction.Typing);

                    //==================================================================

                    if (BotCore.IsMessStartingWith(text, "cancel"))
                    {
                        if (user.Status != "main")
                        {
                            user.Status = "main";
                            Constants.GetDbUsers.Update(user);
                            var r = $"{Constants.EMOJIWARNING} Operation cancelled!";
                            var keyboard = BotCore.CreateInlineKeyboard("sendcommand||sendcommand,menu||help");
                            await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r, replyMarkup: keyboard);
                        }
                        return;
                    }
                    else if (BotCore.IsMessStartingWith(text, "sendid"))
                    {
                        var resp = "";
                        resp += $"#sendid\n{Constants.EMOJIEXCLAMATION} User id {user.Id} used command sendid.\n";
                        resp += BotCore.GetUserInfo(user);
                        var mess = await BotCore.SafeSendTextMessageAsync(Constants.AdminTgId, resp);
                        resp = $"/enableprofile{user.Id}";
                        await BotCore.SafeSendTextMessageAsync(Constants.AdminTgId, resp, replyToMessageId: mess.MessageId);
                        return;
                    }
                    else if (chatId == Constants.AdminTgId && BotCore.IsMessStartingWith(text, "enableprofile"))
                    {
                        var arg = Convert.ToInt64(BotCore.GetArg(text, new List<string>() { "enableprofile" }));
                        var u = Constants.GetDbUsers.FindOne(x => x.Id == arg);
                        if (u == null)
                        {
                            await BotCore.SafeSendTextMessageAsync(Constants.AdminTgId, $"User id {arg} does not exist!", replyMarkup: new ReplyKeyboardRemove());
                            return;
                        }
                        u.Allowed = true;
                        Constants.GetDbUsers.Update(u);
                        var r = $"User id {u.Id} enabled.";
                        await BotCore.SafeSendTextMessageAsync(Constants.AdminTgId, r, replyMarkup: new ReplyKeyboardRemove());
                        return;
                    }
                    else if (chatId == Constants.AdminTgId && BotCore.IsMessStartingWith(text, "disableprofile"))
                    {
                        var arg = Convert.ToInt64(BotCore.GetArg(text, new List<string>() { "disableprofile" }));
                        var u = Constants.GetDbUsers.FindOne(x => x.Id == arg);
                        if (u == null)
                        {
                            await BotCore.SafeSendTextMessageAsync(Constants.AdminTgId, $"User id {arg} does not exist!", replyMarkup: new ReplyKeyboardRemove());
                            return;
                        }
                        u.Allowed = false;
                        Constants.GetDbUsers.Update(u);
                        var r = $"User id {u.Id} disabled.";
                        await BotCore.SafeSendTextMessageAsync(Constants.AdminTgId, r, replyMarkup: new ReplyKeyboardRemove());
                        return;
                    }
                    else if (chatId == Constants.AdminTgId && BotCore.IsMessStartingWith(text, "userinfo"))
                    {
                        var arg = Convert.ToInt64(BotCore.GetArg(text, new List<string>() { "userinfo" }));
                        var u = Constants.GetDbUsers.FindOne(x => x.Id == arg);
                        if (u == null)
                        {
                            await BotCore.SafeSendTextMessageAsync(Constants.AdminTgId, $"User id {arg} does not exist!", replyMarkup: new ReplyKeyboardRemove());
                            return;
                        }
                        var r = BotCore.GetUserInfo(u);
                        await BotCore.SafeSendTextMessageAsync(chatId, r, replyMarkup: new ReplyKeyboardRemove());
                        return;
                    }
                    else if (chatId == Constants.AdminTgId && BotCore.IsMessStartingWith(text, "createuser"))
                    {
                        var arg = Convert.ToInt64(BotCore.GetArg(text, new List<string>() { "createuser" }));
                        var u = Constants.GetDbUsers.FindOne(x => x.Id == arg);
                        if (u == null)
                        {
                            var now = DateTime.Now;
                            Models.User newUser = new Models.User()
                            {
                                FirstName = "",
                                Id = arg,
                                LastName = "",
                                Status = "main",
                                Username = "",
                                CreationDate = now,
                                LastMessage = now,
                                MessagesCounter = 0,
                                Allowed = false
                            };
                            Constants.GetDbUsers.Insert(newUser);
                            await BotCore.SafeSendTextMessageAsync(Constants.AdminTgId, $"User id {arg} created!", replyMarkup: new ReplyKeyboardRemove());
                            return;
                        }
                        var r = BotCore.GetUserInfo(u);
                        await BotCore.SafeSendTextMessageAsync(chatId, r, replyMarkup: new ReplyKeyboardRemove());
                        return;
                    }
                    else if (chatId == Constants.AdminTgId && BotCore.IsMessStartingWith(text, "activemonitor"))
                    {
                        var r = "";
                        if (BackgroundWorker.canMonServer)
                            r = "Monitor already activated.";
                        else
                        {
                            BackgroundWorker.canMonServer = true;
                            r = "Monitor activated.";
                        }
                        await BotCore.SafeSendTextMessageAsync(chatId, r, replyMarkup: new ReplyKeyboardRemove());
                        return;
                    }
                    else if (BotCore.IsMessStartingWith(text, "help") || BotCore.IsMessStartingWith(text, "start"))
                    {
                        BotCore.SetUserStatus(user, "main");
                        var r = "/sendcommand - send rcon commands\n";
                        r += "/stopsendcommand - stop to send rcon commands\n";
                        r += "/offban - offban a player by name or player id\n";
                        r += "/offtempban - offtempban a player by name or player id\n";
                        r += $"/help - print this message\n{Constants.MSGSEPARATION}\n";
                        r += $"Server ip: {Constants.COD4SERVER}\n";
                        r += $"Server port: {Constants.COD4PORT}";
                        var keyboard = BotCore.CreateInlineKeyboard("sendcommand||sendcommand");
                        await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r, replyMarkup: keyboard);
                        return;
                    }
                    else if (BotCore.IsMessStartingWith(text, "offban"))
                    {
                        BotCore.SetUserStatus(user, "offbanning");
                        var r = $"{Constants.EMOJIMEMO} Ok! Send me the player name or id that you want to offban.";
                        var keyboard = BotCore.CreateInlineKeyboard("cancel||cancel");
                        await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r, replyMarkup: keyboard);
                        return;
                    }
                    else if (BotCore.IsMessStartingWith(text, "offtempban"))
                    {
                        BotCore.SetUserStatus(user, "offtempbanning");
                        var r = $"{Constants.EMOJIMEMO} Ok! Send me the player name or id that you want to offtempban.";
                        var keyboard = BotCore.CreateInlineKeyboard("cancel||cancel");
                        await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r, replyMarkup: keyboard);
                        return;
                    }
                    else if (BotCore.IsMessStartingWith(text, "sendcommand"))
                    {
                        var arg = BotCore.GetArg(text, new List<string>() { "sendcommand" });
                        BotCore.SetUserStatus(user, "sendingcommand");

                        if (string.IsNullOrEmpty(arg))
                        {
                            var r = $"{Constants.EMOJIMEMO} Send rcon command to execute.";
                            var keyboard = BotCore.CreateInlineKeyboard("stopsendcommand||stopsendcommand");
                            await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r, replyMarkup: keyboard);
                        }
                        else
                        {
                            arg = arg.ToLower().Trim();
                            if (arg.StartsWith("cvarlist") || arg.StartsWith("quit") ||
                                arg.StartsWith("killserver") || arg.StartsWith("load") ||
                                arg.StartsWith("write") || arg.StartsWith("admin") ||
                                arg.StartsWith("change"))
                            {
                                var resp = $"{Constants.EMOJIWARNING} Cannot execute this command!";
                                resp += $"\n{Constants.MSGSEPARATION}\n{Constants.EMOJIMEMO} Send rcon command to execute.";
                                var keyboard = BotCore.CreateInlineKeyboard("stopsendcommand||stopsendcommand;");
                                await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, resp, replyMarkup: keyboard);
                                return;
                            }
                            var r = await _rcon.ExecuteCommand(arg);
                            r = r.Truncate(3950);
                            if (!string.IsNullOrEmpty(r))
                            {
                                //r = string.Join(Environment.NewLine, r.ToLines().SubArray(1, r.ToLines().Length - 1));
                                r = $"{Constants.EMOJIGREENCHECK} command '{arg}' executed.\nCommand response:\n{Constants.MSGSEPARATION}\n{r}";
                                r += $"\n{Constants.MSGSEPARATION}\n{Constants.EMOJIMEMO} Send rcon command to execute.";
                                var keyboard = BotCore.CreateInlineKeyboard("stopsendcommand||stopsendcommand");
                                await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r, replyMarkup: keyboard);
                            }
                            else
                            {
                                r = $"{Constants.EMOJIWARNING} Error executing the command! Is server online?";
                                r += $"\n{Constants.MSGSEPARATION}\n{Constants.EMOJIMEMO} Send rcon command to execute.";
                                var keyboard = BotCore.CreateInlineKeyboard("stopsendcommand||stopsendcommand");
                                await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r, replyMarkup: keyboard);
                            }
                        }
                        return;
                    }
                    else if (BotCore.IsMessStartingWith(text, "stopsendcommand"))
                    {
                        BotCore.SetUserStatus(user, "main");
                        var r = $"{Constants.EMOJIWARNING} Sending command mode stopped.";
                        var keyboard = BotCore.CreateInlineKeyboard("sendcommand||sendcommand,menu||help");
                        await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r, replyMarkup: keyboard);
                        return;
                    }
                    else if (user.Status == "offbanning" || user.Status == "offtempbanning")
                    {
                        try
                        {
                            var isPlayerId = new Regex(@"^\d{19}$").IsMatch(text);
                            var r = "";
                            if (isPlayerId)
                                r += $"{Constants.EMOJICLOCK} Searching the last valid info for player id {text}...";
                            else
                                r = $"{Constants.EMOJICLOCK} Searching the last valid info for player name {text}...";
                            await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r);
                            await _bot.SendChatActionAsync(chatId, ChatAction.Typing);
                            var plNameToban = text;
                            var connectionInfo = new ConnectionInfo(Constants.SSHHOST,
                                            Constants.SSHPORT,
                                            Constants.SSHUSER,
                                            new PasswordAuthenticationMethod(Constants.SSHUSER, Constants.SSHPASSWORD),
                                            new PrivateKeyAuthenticationMethod("rsa.key"));
                            using (var client = new SshClient(connectionInfo))
                            {
                                client.Connect();
                                var sshCmd = client.CreateCommand($"tail -n{Constants.NLASTLOGLINES} {Constants.SERVERENTERLEAVEFILEPATH}");
                                var cmdRes = sshCmd.Execute().Split("\n", StringSplitOptions.RemoveEmptyEntries);
                                var pattern = @"(.*):\s+\^\d+Client\s+(.*)\s+(\d+\.\d+\.\d+\.\d+):\d+.*left this server from slot \d+.*playerid\s+(\d+)$";
                                var regex = new Regex(pattern, RegexOptions.IgnoreCase);
                                var regexPlId = new Regex(@"^\d{19}$", RegexOptions.IgnoreCase);
                                var plFound = new List<PlayerEnterLeaveInfos>();
                                var plNameAndIdList = new List<string>();
                                for (int i = cmdRes.Length - 1; i >= 0; i--)
                                {
                                    var line = cmdRes[i];
                                    if (regex.IsMatch(line))
                                    {
                                        GroupCollection groups = regex.Match(line).Groups;
                                        PlayerEnterLeaveInfos playerInfos = new PlayerEnterLeaveInfos
                                        {
                                            date = groups["1"].Value,
                                            name = groups["2"].Value,
                                            ip = groups["3"].Value,
                                            id = groups["4"].Value
                                        };
                                        if (!regexPlId.IsMatch(playerInfos.id)) continue;
                                        if (isPlayerId)
                                        {
                                            if (playerInfos.id == text)
                                            {
                                                plFound.Add(playerInfos);
                                                break;
                                            }
                                        }
                                        else
                                        {
                                            if (playerInfos.name.ToLower().Trim().Contains(text.ToLower().Trim()))
                                            {
                                                if (!plNameAndIdList.Contains(playerInfos.name.ToLower().Trim() + playerInfos.id))
                                                {
                                                    plNameAndIdList.Add(playerInfos.name.ToLower().Trim() + playerInfos.id);
                                                    plFound.Add(playerInfos);
                                                }
                                            }
                                        }
                                    }
                                }
                                if (plFound.Count > 1)
                                {
                                    r = $"{Constants.EMOJIWARNING} I found more than one player that matches the given name {text}.\n\n";
                                    r += $"Please repeat the search by entering a more specific name.\n";
                                    var plCounter = plFound.Count;
                                    if (plFound.Count > 20)
                                    {
                                        r += $"Below the ({plFound.Count} totals but shown here 20) names found:\n\n";
                                        plCounter = 20;
                                    }
                                    else
                                        r += $"Below the ({plFound.Count}) names found:\n\n";
                                    for (int i = 0; i < plCounter; i++)
                                    {
                                        r += $"{(i + 1)}) {plFound[i].name}\n(playerid: {plFound[i].id})\n";
                                    }
                                    r += "\nSend a new more specific player name (or restart the /offban or /offtempban operation and send the player id instead player name).";
                                    var keyboard = BotCore.CreateInlineKeyboard("cancel||cancel");
                                    await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r, replyMarkup: keyboard);
                                    return;
                                }
                                else if (plFound.Count == 0)
                                {
                                    r = $"{Constants.EMOJIWARNING} I did not find any recent player that matches the given name {text}.\n\n";
                                    r += $"Please repeat the search by entering a different name.";
                                    var keyboard = BotCore.CreateInlineKeyboard("cancel||cancel");
                                    await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r, replyMarkup: keyboard);
                                    return;
                                }
                                else
                                {
                                    var tempPlName = plFound[0].name.Replace("||124816||", "");
                                    var customOffBanStatus = $"||124816||{tempPlName}||124816||{plFound[0].id}||124816||{plFound[0].ip}||124816||{plFound[0].date}";
                                    var q = "";
                                    if (user.Status == "offbanning")
                                    {
                                        q = $"Are you sure you want to ban this player?";
                                        BotCore.SetUserStatus(user, $"offbanfound{customOffBanStatus}");
                                    }
                                    else
                                    {
                                        q = $"Are you sure you want to tempban this player?";
                                        BotCore.SetUserStatus(user, $"offtempbanfound{customOffBanStatus}");
                                    }
                                    r = $"{Constants.EMOJIINFORMATION} I found this player:\n\n";
                                    r += $"last seen online: {plFound[0].date}\n";
                                    r += $"player name: {plFound[0].name}\n";
                                    r += $"player ip: {plFound[0].ip}\n";
                                    r += $"player id: {plFound[0].id}\n\n";
                                    r += q;
                                    var keyboard = BotCore.CreateInlineKeyboard("yes||yes,no||no");
                                    await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r, replyMarkup: keyboard);
                                    return;
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            ex.ToString().Error();
                            BotCore.SetUserStatus(user, "main");
                            var r = $"{Constants.EMOJIWARNING} An error occurred while processing the offban operation!";
                            await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r);
                        }
                        return;
                    }
                    else if (user.Status.StartsWith("offtempbanfound"))
                    {
                        if (text == "yes")
                        {
                            var statusParsed = user.Status.Split("||124816||");
                            var playerName = statusParsed[1];
                            var playerId = statusParsed[2];
                            var playerIp = statusParsed[3];
                            var playerDate = statusParsed[4];
                            var r = $"{Constants.EMOJIPENCIL} Ok, send how much the player ({playerName}) must be tempbanned.\n\n";
                            r += "Input accepted: ^([1-9]{1}[0-9]{0,2})(m|h|d)$\n";
                            r += $"m - minutes, h - hours, d - days.\nFor example: 5h means the player will be tempbanned for 5 hours.";
                            var customOffTempBanStatus = $"||124816||{playerName}||124816||{playerId}||124816||{playerIp}||124816||{playerDate}";
                            BotCore.SetUserStatus(user, $"confirmedofftempbanfound{customOffTempBanStatus}");
                            var keyboard = BotCore.CreateInlineKeyboard("cancel||cancel");
                            await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r, replyMarkup: keyboard);
                            return;
                        }
                        else
                        {
                            BotCore.SetUserStatus(user, "main");
                            var r = $"{Constants.EMOJIWARNING} Operation cancelled!";
                            var keyboard = BotCore.CreateInlineKeyboard("sendcommand||sendcommand,menu||help");
                            await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r, replyMarkup: keyboard);
                            return;
                        }
                    }
                    else if (user.Status.StartsWith("offbanfound") || user.Status.StartsWith("confirmedofftempbanfound"))
                    {
                        int tempBanValue = 0;
                        string tempBanTime = "";
                        if (user.Status.StartsWith("confirmedofftempbanfound"))
                        {
                            var pattern = @"^([1-9]{1}[0-9]{0,2})(m|h|d)$";
                            var regex = new Regex(pattern, RegexOptions.IgnoreCase);
                            if (regex.IsMatch(text))
                            {
                                GroupCollection groups = regex.Match(text).Groups;
                                tempBanValue = Convert.ToInt32(groups["1"].Value);
                                tempBanTime = groups["2"].Value;
                            }
                            else
                            {
                                var r = $"{Constants.EMOJIWARNING} Invalid input!\n\n";
                                r += "Input accepted: ^([1-9]{1}[0-9]{0,2})(m|h|d)$\n";
                                r += $"m - minutes, h - hours, d - days.\nFor example: 5h means the player will be tempbanned for 5 hours.";
                                var keyboard = BotCore.CreateInlineKeyboard("cancel||cancel");
                                await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r, replyMarkup: keyboard);
                                return;
                            }
                        }
                        if (text == "yes" || tempBanValue != 0)
                        {
                            try
                            {
                                await _bot.SendChatActionAsync(chatId, ChatAction.Typing);
                                var statusParsed = user.Status.Split("||124816||");
                                var playerName = statusParsed[1].Replace(" ", "")
                                                                .Replace("\"", "")
                                                                .Replace("'", "")
                                                                .Replace("\\", "")
                                                                .Replace("%", "")
                                                                .Replace(";", "")
                                                                .Replace(":", "")
                                                                .Replace(">", "")
                                                                .Replace("<", "")
                                                                .Replace("*", "")
                                                                .Replace("$", "")
                                                                .Replace("!", "")
                                                                .Replace("`", "")
                                                                .Replace("?", "")
                                                                .Replace("'", "")
                                                                .Replace("(", "")
                                                                .Replace(")", "")
                                                                .Replace(",", "")
                                                                .Replace("[", "")
                                                                .Replace("]", "")
                                                                .Replace("^", "")
                                                                .Replace("|", "")
                                                                .Replace("{", "")
                                                                .Replace("}", "")
                                                                .Replace("&", "");
                                if (playerName == "") playerName = "invalid name";
                                var playerId = statusParsed[2];
                                var playerIp = statusParsed[3];
                                var unixDate = DateTime.Now.ToUnixEpochDate();
                                long unixTempBanDate = -1;
                                if (tempBanValue != 0)
                                {
                                    switch (tempBanTime)
                                    {
                                        case "d": unixTempBanDate = unixDate + 86400 * tempBanValue; break;
                                        case "h": unixTempBanDate = unixDate + 3600 * tempBanValue; break;
                                        case "m": unixTempBanDate = unixDate + 60 * tempBanValue; break;
                                        default: unixTempBanDate = unixDate + 60 * tempBanValue; break;
                                    }
                                }
                                var reason = "";
                                var tempReason = "";
                                var tempReasonAlready = "";
                                if (tempBanValue != 0)
                                {
                                    reason = "offtempbanned by an automatic process ";
                                    var dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds(unixTempBanDate);
                                    tempReason = $"offtempbanned (until {String.Format("{0:dd/MM/yyyy HH:mm:ss}", dateTimeOffset.DateTime.ToLocalTime())})";
                                    tempReasonAlready = "offtempbanned";
                                }
                                else
                                {
                                    reason = "offbanned by an automatic process ";
                                    tempReason = "offbanned";
                                    tempReasonAlready = "offbanned";
                                }
                                var lineToAddToBanList = $"\\\\netadr\\\\{playerIp}\\\\create\\\\{unixDate}\\\\exp\\\\{unixTempBanDate}\\\\rsn\\\\{reason}\\\\nick\\\\{playerName}\\\\asteamid\\\\0\\\\playerid\\\\{playerId}\\\\";
                                var connectionInfo = new ConnectionInfo(Constants.SSHHOST,
                                                Constants.SSHPORT,
                                                Constants.SSHUSER,
                                                new PasswordAuthenticationMethod(Constants.SSHUSER, Constants.SSHPASSWORD),
                                                new PrivateKeyAuthenticationMethod("rsa.key"));
                                using (var client = new SshClient(connectionInfo))
                                {
                                    client.Connect();
                                    //check if already banned or tempbanned
                                    var sshCmd = client.CreateCommand($"cat {Constants.SERVERBANLISTFILEPATH}");
                                    var cmdRes = sshCmd.Execute().Split("\n", StringSplitOptions.RemoveEmptyEntries);
                                    var pattern = @"\\netadr\\\d+\.\d+\.\d+\.\d+\\create\\\d+\\exp\\(.*)\\rsn\\.*\\nick\\.*\\asteamid\\\d+\\playerid\\(\d{19})\\";
                                    var regex = new Regex(pattern, RegexOptions.IgnoreCase);
                                    var isAlreadyBanned = false;
                                    long expBanUnixTime = 0;
                                    for (int i = cmdRes.Length - 1; i >= 0; i--)
                                    {
                                        var line = cmdRes[i];
                                        if (regex.IsMatch(line))
                                        {
                                            GroupCollection groups = regex.Match(line).Groups;
                                            if (playerId == groups["2"].Value)
                                            {
                                                long.TryParse(groups["1"].Value, out expBanUnixTime);
                                                isAlreadyBanned = true;
                                                // fix banning a pl who is already tempbanned from bot
                                                // in this case I'll force the ban line so we have, at the end, two lines that ban the same pl
                                                if (tempBanValue == 0 && expBanUnixTime > 0)
                                                {
                                                    isAlreadyBanned = false;
                                                }
                                                break;
                                            }
                                        }
                                    }
                                    if (isAlreadyBanned)
                                    {

                                        var untilInfo = "";
                                        if (expBanUnixTime > 0)
                                        {
                                            var dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds(expBanUnixTime);
                                            untilInfo = $" (until {String.Format("{0:dd/MM/yyyy HH:mm:ss}", dateTimeOffset.DateTime.ToLocalTime())})";
                                        }
                                        var res = $"{Constants.EMOJIWARNING} Player {playerName} (player id: {playerId}) is already {tempReasonAlready.Replace("off", "")}{untilInfo}!";
                                        if (tempBanValue != 0)
                                        {
                                            res += $"\n\n{Constants.EMOJIINFORMATION} If you want to change this tempban you can unban the player sending the command\n\n";
                                            res += $"unban {playerId}\n\nand then add again the tempban with the same id with the time you want.";
                                        }
                                        await BotCore.SafeSendOrEditTextMessageAsync(false, chatId, messageId, res);
                                        await Task.Delay(1000);
                                        res = "";
                                        res += "/sendcommand - send rcon commands\n";
                                        res += "/stopsendcommand - stop to send rcon commands\n";
                                        res += "/offban - offban a player by name or player id\n";
                                        res += "/offtempban - offtempban a player by name or player id\n";
                                        res += $"/help - print this message\n{Constants.MSGSEPARATION}\n";
                                        res += $"Server ip: {Constants.COD4SERVER}\n";
                                        res += $"Server port: {Constants.COD4PORT}";
                                        BotCore.SetUserStatus(user, "main");
                                        var key = BotCore.CreateInlineKeyboard("sendcommand||sendcommand");
                                        await BotCore.SafeSendOrEditTextMessageAsync(false, chatId, messageId, res, replyMarkup: key);
                                        return;
                                    }
                                    sshCmd = client.CreateCommand($"echo \"{lineToAddToBanList}\" >> {Constants.SERVERBANLISTFILEPATH}");
                                    var sshRes = sshCmd.Execute();
                                    sshCmd = client.CreateCommand($"echo \"{lineToAddToBanList}\" >> {Constants.SERVERBANLISTFILEPATH}.tmp");
                                    sshRes = sshCmd.Execute();
                                    await Task.Delay(2000);
                                    var rconCmd = $"exec {Constants.RELOADBANPLUGINSCRIPTNAME}";
                                    await _rcon.ExecuteCommand(rconCmd);
                                    await Task.Delay(1000);
                                    var r = $"{Constants.EMOJIGREENCHECK} Player {playerName} (player id: {playerId}) {tempReason}!";
                                    await BotCore.SafeSendOrEditTextMessageAsync(false, chatId, messageId, r);
                                    await Task.Delay(1000);
                                    r = "";
                                    r += "/sendcommand - send rcon commands\n";
                                    r += "/stopsendcommand - stop to send rcon commands\n";
                                    r += "/offban - offban a player by name or player id\n";
                                    r += "/offtempban - offtempban a player by name or player id\n";
                                    r += $"/help - print this message\n{Constants.MSGSEPARATION}\n";
                                    r += $"Server ip: {Constants.COD4SERVER}\n";
                                    r += $"Server port: {Constants.COD4PORT}";
                                    BotCore.SetUserStatus(user, "main");
                                    var keyboard = BotCore.CreateInlineKeyboard("sendcommand||sendcommand");
                                    await BotCore.SafeSendOrEditTextMessageAsync(false, chatId, messageId, r, replyMarkup: keyboard);
                                    return;
                                }
                            }
                            catch (Exception ex)
                            {
                                ex.ToString().Error();
                                BotCore.SetUserStatus(user, "main");
                                var r = $"{Constants.EMOJIWARNING} An error occurred while processing the offban operation!";
                                await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r);
                                return;
                            }
                        }
                        else
                        {
                            BotCore.SetUserStatus(user, "main");
                            var r = $"{Constants.EMOJIWARNING} Operation cancelled!";
                            var keyboard = BotCore.CreateInlineKeyboard("sendcommand||sendcommand,menu||help");
                            await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r, replyMarkup: keyboard);
                            return;
                        }
                    }
                    else if (user.Status == "sendingcommand")
                    {
                        text = text.ToLower().Trim();
                        if (text.StartsWith("cvarlist") || text.StartsWith("quit") ||
                                text.StartsWith("killserver") || text.StartsWith("load") ||
                                text.StartsWith("write") || text.StartsWith("admin") ||
                                text.StartsWith("change"))
                        {
                            var resp = $"{Constants.EMOJIWARNING} Cannot execute this command!";
                            resp += $"\n{Constants.EMOJIMEMO} Send rcon command to execute.";
                            var keyboard = BotCore.CreateInlineKeyboard("stopsendcommand||stopsendcommand;");
                            await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, resp, replyMarkup: keyboard);
                            return;
                        }
                        var r = await _rcon.ExecuteCommand(text);
                        r = r.Truncate(3950);
                        if (!string.IsNullOrEmpty(r))
                        {
                            //r = string.Join(Environment.NewLine, r.ToLines().SubArray(1, r.ToLines().Length - 1));
                            r = $"{Constants.EMOJIGREENCHECK} command '{text}' executed.\nCommand response:\n{Constants.MSGSEPARATION}\n{r}";
                            r += $"\n{Constants.MSGSEPARATION}\n{Constants.EMOJIMEMO} Send rcon command to execute.";
                            var keyboard = BotCore.CreateInlineKeyboard("stopsendcommand||stopsendcommand;");
                            await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r, replyMarkup: keyboard);
                        }
                        else
                        {
                            r = $"{Constants.EMOJIWARNING} Error executing the command! Is server online?";
                            r += $"\n{Constants.MSGSEPARATION}\n{Constants.EMOJIMEMO} Send rcon command to execute.";
                            var keyboard = BotCore.CreateInlineKeyboard("stopsendcommand||stopsendcommand");
                            await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r, replyMarkup: keyboard);
                        }
                        return;
                    }
                    else if (chatId == Constants.AdminTgId && BotCore.IsMessStartingWith(text, "botinfo"))
                    {
                        var r = BotCore.GetBotInfo();
                        await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r);
                        return;
                    }
                    else
                    {
                        BotCore.SetUserStatus(user, "main");
                        var r = "/sendcommand - send rcon commands\n";
                        r += "/stopsendcommand - stop to send rcon commands\n";
                        r += "/offban - offban a player by name or player id\n";
                        r += "/offtempban - offtempban a player by name or player id\n";
                        r += $"/help - print this message\n{Constants.MSGSEPARATION}\n";
                        r += $"Server ip: {Constants.COD4SERVER}\n";
                        r += $"Server port: {Constants.COD4PORT}";
                        var keyboard = BotCore.CreateInlineKeyboard("sendcommand||sendcommand");
                        await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r, replyMarkup: keyboard);
                        return;
                    }
                    //else if (BotCore.IsMessStartingWith(text, "userinfo"))
                    //{
                    //    var r = BotCore.GetUserInfo(user);
                    //    await BotCore.SafeSendOrEditTextMessageAsync(mustEditMess, chatId, messageId, r);
                    //    return;
                    //}

                }
                catch (Exception ex)
                {
                    ex.ToString().Error();
                }
            }
        }
    }
}