using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Unosquare.Swan;

namespace Cod4managerbot
{
    class Rcon
    {
        private string _cod4Server = "";
        private int _cod4Port = 0;
        private string _cod4Rcon = "";

        public Rcon(string cod4Server, int cod4Port, string cod4Rcon)
        {
            _cod4Server = cod4Server;
            _cod4Port = cod4Port;
            _cod4Rcon = cod4Rcon;
        }

        private byte[] CreateCommand(string command)
        {
            string cmd = "rcon " + _cod4Rcon + " " + command;
            byte[] bufferTemp = Encoding.ASCII.GetBytes(cmd);
            byte[] bufferSend = new byte[bufferTemp.Length + 5];

            //intial 5 characters as per standard
            bufferSend[0] = byte.Parse("255");
            bufferSend[1] = byte.Parse("255");
            bufferSend[2] = byte.Parse("255");
            bufferSend[3] = byte.Parse("255");
            //bufferSend[4] = byte.Parse("02");
            int j = 4;

            for (int i = 0; i < bufferTemp.Length; i++)
            {
                bufferSend[j++] = bufferTemp[i];
            }
            bufferSend[bufferSend.Length - 1] = byte.Parse("00");
            return bufferSend;
        }

        public async Task<string> ExecuteCommand(string command)
        {
            var res = await _executeCommand(command);
            if (string.IsNullOrEmpty(res))
            {
                await Task.Delay(5000);
                return await _executeCommand(command);
            }
            else
                return res;
        }

        public async Task<bool> IsServerOnline()
        {
            var r = await ExecuteCommand("status");
            return r != "";
        }

        private async Task<string> _executeCommand(string command)
        {
            try
            {
                var done = false;
                var res = "";
                Socket _socket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
                await _socket.ConnectAsync(IPAddress.Parse(_cod4Server), _cod4Port);

                //send rcon command and get response
                ArraySegment<byte> byteArraySeg = new ArraySegment<byte>(CreateCommand(command));
                await _socket.SendAsync(byteArraySeg, SocketFlags.None);

                byteArraySeg = new ArraySegment<byte>(new byte[65000]);

                var receiver = _socket.ReceiveAsync(byteArraySeg, SocketFlags.None);
                receiver.Wait(3000);
                //res += Encoding.ASCII.GetString(byteArraySeg.ToArray());
                var tempList = new List<string>
                {
                    Encoding.ASCII.GetString(byteArraySeg.ToArray())
                };
                string tempString = "";
                int c = 0;
                while (receiver.Status == TaskStatus.RanToCompletion && c < 50)
                {
                    c++;
                    receiver = _socket.ReceiveAsync(byteArraySeg, SocketFlags.None);
                    tempString = Encoding.ASCII.GetString(byteArraySeg.ToArray());
                    if (!tempList.Contains(tempString)) tempList.Add(tempString);
                }

                for (int i = 0; i < tempList.Count; i++)
                {
                    if (tempList[i].Contains("????print")) done = true;
                    res += tempList[i].Replace("\0", string.Empty).Replace("????print\n", string.Empty);
                }

                var lines = res.ToLines();
                res = "";
                for (int i = 0; i < lines.Length; i++)
                {
                    if (lines[i].Trim() != "")
                    {
                        if (i == lines.Length - 1)
                            res += lines[i];
                        else
                            res += lines[i] + Environment.NewLine;
                    }
                }
                var tList = res.ToLines().ToList();
                if (tList[tList.Count - 1].Trim() == "")
                    tList.RemoveAt(tList.Count - 1);

                res = string.Join(Environment.NewLine, tList);

                _socket.Dispose();

                if (!done) res = "";
                if (done & res.Trim() == "") res = "Success";
                return res;
            }
            catch (Exception) { return ""; }
        }

        private string _getMap(string rconStatusResponse)
        {
            try
            {
                return rconStatusResponse.ToLines()[5].Substring(10);
            }
            catch (Exception) { return ""; }
        }

        private string _getHostname(string rconStatusResponse)
        {
            try
            {
                return rconStatusResponse.ToLines()[0].Substring(10);
            }
            catch (Exception) { return ""; }
        }
    }
}
