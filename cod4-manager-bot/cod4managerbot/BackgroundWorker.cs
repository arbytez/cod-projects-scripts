using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Unosquare.Swan;

namespace Cod4managerbot
{
    public class BackgroundWorker
    {
        public static bool canMonServer = true;

        public BackgroundWorker()
        {
            Task.Factory.StartNew(async () => await WorkerAsync());
        }

        private async Task WorkerAsync()
        {
            $"BackgroundWorker running...".Debug();
            DateTime dtNow = DateTime.MinValue;
            int hour = 0;
            int second = 0;
            int day = 0;
            int minute = 0;
            bool isServerOnline = false;
            Rcon _rcon = new Rcon(Constants.COD4SERVER, Constants.COD4PORT, Constants.COD4RCON);

            while (true)
            {
                dtNow = DateTime.Now;
                day = dtNow.Day;
                hour = dtNow.Hour;
                minute = dtNow.Minute;
                second = dtNow.Second;

                try
                {
                    //async operations
                    if (canMonServer)
                    {
                        $"Checking server status...".Debug();
                        isServerOnline = await _rcon.IsServerOnline();
                        if (isServerOnline)
                            $"Server is online.".Debug();
                        else
                            $"Server is not online.".Debug();
                        if (!isServerOnline)
                        {
                            canMonServer = false;
                            var r = $"{Constants.EMOJIWARNING} Server ip {Constants.COD4SERVER}:{Constants.COD4PORT} is offline!\n/activemonitor";
                            await BotCore.SafeSendTextMessageAsync(Constants.AdminTgId, r);
                        }
                    }
                }
                catch (Exception ex)
                {
                    ex.ToString().Error();
                }

                await Task.Delay(new TimeSpan(0, 5, 0));
            }
        }
    }
}
