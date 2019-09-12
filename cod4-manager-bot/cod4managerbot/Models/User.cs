using System;
using System.Collections.Generic;
using System.Text;
using Telegram.Bot.Types;

namespace Cod4managerbot.Models
{
    public class User
    {
        public long Id { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Status { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime LastMessage { get; set; }
        public long MessagesCounter { get; set; }
        public bool Allowed { get; set; }
    }
}
