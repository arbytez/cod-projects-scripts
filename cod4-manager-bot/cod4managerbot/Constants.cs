using LiteDB;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Telegram.Bot;

namespace Cod4managerbot
{
    public static class Constants
    {
        public static LiteDatabase GetLiteDatabase = new LiteDatabase(DataBaseFullPath);
        public static Dictionary<string, string> GetDictConfigData = JsonConvert.DeserializeObject<Dictionary<string, string>>(File.ReadAllText(ConfigFullPath));
        private static string _dataDirectory = null;
        private static string _databaseFullPath = null;
        private static string _configFullPath = null;
        private static Dictionary<string, string> _dictConfigData = null;
        private static TelegramBotClient _bot = null;
        public const string EMOJIBALL = "\U000026BD";
        public const string EMOJICLOCK = "\U0001F553";
        public const string EMOJIHOURGLASS = "\U0000231B";
        public const string EMOJIFLAG = "\U0001F3C1";
        public const string EMOJIALARM = "\U000023F0";
        public const string EMOJIWARNING = "\U000026A0";
        public const string EMOJISPEAKER = "\U0001F50A";
        public const string EMOJIMAGNIFYINGGLASS = "\U0001F50E";
        public const string EMOJILOUDSPEAKER = "\U0001F4E2";
        public const string EMOJIEXCLAMATION = "\U00002757";
        public const string EMOJIMUSCLE = "\U0001F4AA";
        public const string EMOJIGREENCHECK = "\U00002705";
        public const string EMOJIMEMO = "\U0001F4DD";
        public const string EMOJITELESCOPE = "\U0001F52D";
        public const string EMOJIHIGHVOLTAGE = "\U000026A1";
        public const string EMOJIINFORMATION = "\U00002139";
        public const string EMOJIMAIL = "\U0001F4E7";
        public const string EMOJINOSPEAKER = "\U0001F507";
        public const string EMOJISPARKLES = "\U00002728";
        public const string EMOJITHUMBSUP = "\U0001F44D";
        public const string EMOJISMILE = "\U0001F60A";
        public const string EMOJIRUNNER = "\U0001F3C3";
        public const string EMOJIPUSHPIN = "\U0001F4CC";
        public const string EMOJIWATCH = "\U0000231A";
        public const string EMOJIOPENBOOK = "\U0001F4D6";
        public const string EMOJIGLOBE = "\U0001F310";
        public const string EMOJIFAMILY = "\U0001F46A";
        public const string EMOJISIMPLECHECK = "\U00002714";
        public const string EMOJIPENCIL = "\U0000270F";
        public const string EMOJIBUG = "\U0001F41E";
        public const string EMOJISMILINGFACE = "\U0001F603";
        public const string EMOJIEYES = "\U0001F440";
        public const string EMOJIBLACKCHECKMARK = "\U00002714";
        public const string EMOJIBLACKCROSS = "\U00002716";
        public const string EMOJIRECYCLING = "\U0000267B";
        public const string EMOJIVERSION = "\U0001F4C8";
        public const string EMOJICOMPUTER = "\U0001F4BB";
        public const string EMOJIREDCIRCLE = "\U0001F534";
        public const string EMOJIMEGAPHONE = "\U0001F4E3";
        public const string SEPARATION = "||";
        public const string MSGSEPARATION = "------------";
        public static string COD4SERVER = GetConfigParValue("cod4Server");
        public static int COD4PORT = Convert.ToInt32(GetConfigParValue("cod4Port"));
        public static string COD4RCON = GetConfigParValue("cod4Rcon");
        public static string SSHHOST = GetConfigParValue("sshHost");
        public static int SSHPORT = Convert.ToInt32(GetConfigParValue("sshPort"));
        public static string SSHUSER = GetConfigParValue("sshUser");
        public static string SSHPASSWORD = GetConfigParValue("sshPassword");
        public static string SERVERBANLISTFILEPATH = GetConfigParValue("serverBanListFilePath");
        public static string SERVERENTERLEAVEFILEPATH = GetConfigParValue("serverEnterLeaveFilePath");
        public static string RELOADBANPLUGINSCRIPTNAME = GetConfigParValue("reloadBanPluginScriptName");
        public static string NLASTLOGLINES = GetConfigParValue("nLastLogLines");

        private static long _adminTgId = -1;
        public static long AdminTgId
        {
            get
            {
                if (_adminTgId == -1)
                {
                    var res = GetConfigParValue("adminTgId");
                    if (string.IsNullOrEmpty(res)) return -1;
                    _adminTgId = Convert.ToInt64(res);
                    return _adminTgId;
                }
                else
                {
                    return _adminTgId;
                }
            }
        }

        private static string _adminUsername;
        public static string AdminUsername
        {
            get
            {
                if (string.IsNullOrEmpty(_adminUsername))
                {
                    _adminUsername = GetConfigParValue("adminUsername");
                    return _adminUsername;
                }
                else
                {
                    return _adminUsername;
                }
            }
        }

        public static string DataDirectory
        {
            get
            {
                if (string.IsNullOrWhiteSpace(_dataDirectory))
                {
                    var localAppDataDirectory = Directory.GetCurrentDirectory();
                    _dataDirectory = Path.Combine(localAppDataDirectory, "Data");
                    if (!Directory.Exists(_dataDirectory))
                    {
                        Directory.CreateDirectory(_dataDirectory);
                    }
                }

                return _dataDirectory;
            }
        }

        public static string DatabaseFullPath
        {
            get
            {
                if (String.IsNullOrWhiteSpace(_databaseFullPath))
                {
                    string tmp = Path.Combine(DataDirectory, "db");
                    if (!Directory.Exists(tmp))
                    {
                        Directory.CreateDirectory(tmp);
                    }
                    _databaseFullPath = Path.Combine(tmp, "database.sqlite");
                }
                return _databaseFullPath;
            }
        }

        public static string ConfigFullPath
        {
            get
            {
                if (String.IsNullOrWhiteSpace(_configFullPath))
                {
                    string tmp = Path.Combine(DataDirectory, "config");
                    if (!Directory.Exists(tmp))
                    {
                        Directory.CreateDirectory(tmp);
                    }
                    _configFullPath = Path.Combine(tmp, "config.json");
                    if (!File.Exists(_configFullPath))
                    {
                        var content = JsonConvert.SerializeObject(new Dictionary<string, string>(), Formatting.Indented);
                        File.WriteAllText(_configFullPath, content);
                    }
                }
                return _configFullPath;
            }
        }

        public static string DataBaseFullPath
        {
            get
            {
                if (String.IsNullOrWhiteSpace(_databaseFullPath))
                {
                    string tmp = Path.Combine(DataDirectory, "db");
                    if (!Directory.Exists(tmp))
                    {
                        Directory.CreateDirectory(tmp);
                    }
                    _databaseFullPath = Path.Combine(tmp, "database.db");
                }
                return _databaseFullPath;
            }
        }

        public static LiteCollection<Models.User> GetDbUsers
        {
            get
            {
                return GetLiteDatabase.GetCollection<Models.User>("users");
            }
        }

        public static TelegramBotClient GetTelegramBotClient
        {
            get
            {
                if (_bot is TelegramBotClient)
                {
                    return _bot;
                }
                else
                {
                    _bot = new TelegramBotClient(GetConfigParValue("botToken"));
                    return _bot;
                }
            }
        }

        public static string GetConfigParValue(string valueName)
        {
            try
            {
                if (string.IsNullOrEmpty(valueName)) return "";
                var dict = GetDictConfigData;
                if (!dict.ContainsKey(valueName)) return "";
                return dict[valueName];
            }
            catch (Exception)
            {
                return "";
            }
        }

        public static void ReloadConfig()
        {
            _dictConfigData = JsonConvert.DeserializeObject<Dictionary<string, string>>(File.ReadAllText(ConfigFullPath));
        }

    }
}
