using System;
using System.Collections.Generic;
using System.Text;

namespace Cod4managerbot.Models
{
    class Player
    {
        public int Num { get; set; }
        public int Score { get; set; }
        public int Ping { get; set; }
        public string PlayerID { get; set; }
        public string SteamID { get; set; }
        public string Name { get; set; }
        public int LastMsg { get; set; }
        public string Address { get; set; }
        public int QPort { get; set; }
        public int Rate { get; set; }
    }
}
