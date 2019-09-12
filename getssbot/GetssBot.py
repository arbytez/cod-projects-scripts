#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# pip install python-telegram-bot --upgrade 
# https://github.com/python-telegram-bot/python-telegram-bot

# pip install tinydb --upgrade
# https://github.com/msiemens/tinydb

# sendss - Send screenshots made in the last n seconds
# deletess - Delete screenshots made more than n seconds ago
# startautoss - Bot will start to send you all new screenshots found
# stopautoss - Bot will stop to send you new screenshots found
# help - print all commands available
# start - print all commands available

import sys
import pprint
import time
import os
from tinydb import TinyDB, Query
from datetime import datetime
from os import listdir
from os.path import isfile, join
import telegram
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, Job
import logging

if len(sys.argv) != 3:
    print("Wrong number of parameters!\nUsed: {0}\nExpected: {1}".format(len(sys.argv) - 1, 2))
    sys.exit(1)

pathToMonitor = str(sys.argv[1])
seconds_offset = int(sys.argv[2])

botstart = datetime.now()
botname = "GetssBot"

token_bot = 'your-token-bot' # GetssBot

mytgid = 0 # your telegram id
another_tg_id = 0 # another tg id, can be a group (negative num)

special_ids = [ mytgid, another_tg_id, ] # put here all the tg account id that you want to let use this bot

logfilename = os.getcwd() + "/log/" + botstart.strftime(botname + '_%Y_%m_%d_%H_%M_%S.log')

# check directory
if not os.path.exists(os.getcwd() + '/log/'):
    os.makedirs(os.getcwd() + '/log/')
if not os.path.exists(os.getcwd() + '/db/'):
    os.makedirs(os.getcwd() + '/db/')
    
# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.WARN,
    filename=logfilename,
    filemode='a')

logger = logging.getLogger(__name__)

# db init
db = TinyDB(os.getcwd() + '/db/database.json')
q = Query()

for user in special_ids:
    if db.search(q.user == user) == []:
        db.insert( { 'user': user, 'autoss': False })

old_files = []

def welcome_msg():
    msg = ''
    msg += '/sendss - Send screenshot made in the last n seconds\n'
    msg += '/deletess - Delete screenshot made more than n seconds ago\n'
    msg += '/startautoss - Bot will start to send you all new screenshot found\n'
    msg += '/stopautoss - Bot will stop to send you new screenshot found\n'
    msg += '/help - print all commands available\n'
    msg += '/start - print all commands available\n'
    return msg

def all_cmds():
    msg = ''
    msg += '/sendss\n'
    msg += '/deletess\n'
    msg += '/startautoss\n'
    msg += '/stopautoss'
    return msg

def job_sendStartMsg(bot, job):
	logger.warn('Bot started!')
	bot.sendMessage(mytgid, "Started!\n" + all_cmds())
	now = datetime.now()
	n_image_found = 0
	onlyfiles = [f for f in listdir(pathToMonitor) if isfile(join(pathToMonitor, f))]
	for filename in onlyfiles:
		fullpathfile = pathToMonitor + "/" + filename
		if os.path.splitext(filename)[1] == '.jpg':
			if abs(now.timestamp() - os.path.getctime(fullpathfile)) > seconds_offset:
				try:
					os.remove(fullpathfile)
					n_image_found += 1
				except:
					pass
	
	bot.sendMessage(chat_id=mytgid, text='Total screenshot deleted: {0}.\n{1}'.format(n_image_found, all_cmds()))

def job_checkss(bot, job):
    onlyfiles = [f for f in listdir(pathToMonitor) if isfile(join(pathToMonitor, f))]
    if onlyfiles == []:
        old_files.clear()
    else:
        users = db.search(q.autoss == True)
        ss_sended = False
        ss_found = 0
        for filename in onlyfiles:
            fullpathfile = pathToMonitor + "/" + filename
            if os.path.splitext(filename)[1] == '.jpg':
                if not fullpathfile in old_files:
                    old_files.append(fullpathfile)
                    ss_found += 1
                    for d in users:
                        bot.sendPhoto(chat_id=d['user'], photo=open(fullpathfile, 'rb'), caption=filename)
                        ss_sended = True
        #if ss_sended:
        #    for d in users:
        #        if ss_found > 1:
        #            bot.sendMessage(chat_id=d['user'], text=str(ss_found) + ' new screenshots found!\nUse /stopautoss command for stop receiving new screenshots.')
        #        else:
        #            bot.sendMessage(chat_id=d['user'], text=str(ss_found) + ' new screenshot found!\nUse /stopautoss command for stop receiving new screenshots.')
                    

def job_deletess(bot, job):
	now = datetime.now()
	n_image_found = 0
	onlyfiles = [f for f in listdir(pathToMonitor) if isfile(join(pathToMonitor, f))]
	for filename in onlyfiles:
		fullpathfile = pathToMonitor + "/" + filename
		if os.path.splitext(filename)[1] == '.jpg':
			if abs(now.timestamp() - os.path.getctime(fullpathfile)) > seconds_offset:
				try:
					os.remove(fullpathfile)
					n_image_found += 1
				except:
					pass
	
	bot.sendMessage(chat_id=mytgid, text='Total screenshot deleted: {0}.\n{1}'.format(n_image_found, all_cmds()))
    
def start(bot, update):
    if update.message.date > botstart:
        if update.message.chat_id in special_ids: 
            bot.sendMessage(chat_id=update.message.chat_id, text=welcome_msg())

def help(bot, update):
    if update.message.date > botstart:
        if update.message.chat_id in special_ids: 
            bot.sendMessage(chat_id=update.message.chat_id, text=welcome_msg())
            
def sendss(bot, update):
    if update.message.date > botstart:
        if update.message.chat_id in special_ids:
            #bot = telegram.Bot(token_bot)
            now = datetime.now()
            n_image_found = 0
            onlyfiles = [f for f in listdir(pathToMonitor) if isfile(join(pathToMonitor, f))]
            for filename in onlyfiles:
                fullpathfile = pathToMonitor + "/" + filename
                if os.path.splitext(filename)[1] == '.jpg':
                    if abs(now.timestamp() - os.path.getctime(fullpathfile)) <= seconds_offset:
                        n_image_found += 1
                        bot.sendPhoto(chat_id=update.message.chat_id, photo=open(fullpathfile, 'rb'), caption=filename)
                    
            bot.sendMessage(chat_id=update.message.chat_id, text='Total screenshot found: {0}.\n{1}'.format(n_image_found, all_cmds()))


def deletess(bot, update):
    if update.message.date > botstart:
        if update.message.chat_id in special_ids:
            #bot = telegram.Bot(token_bot)
            now = datetime.now()
            n_image_found = 0
            onlyfiles = [f for f in listdir(pathToMonitor) if isfile(join(pathToMonitor, f))]
            for filename in onlyfiles:
                fullpathfile = pathToMonitor + "/" + filename
                if os.path.splitext(filename)[1] == '.jpg':
                    if abs(now.timestamp() - os.path.getctime(fullpathfile)) > seconds_offset:
                        try:
                            os.remove(fullpathfile)      
                            n_image_found += 1
                        except:
                            pass
                        
            bot.sendMessage(chat_id=update.message.chat_id, text='Total screenshot deleted: {0}.\n{1}'.format(n_image_found, all_cmds()))
    
def startautoss(bot, update):
    if update.message.date > botstart:
        if update.message.chat_id in special_ids:    
            users = db.search(q.user == update.message.chat_id)
            if len(users) == 1:
                d = users[0]
                if d['autoss']:
                    bot.sendMessage(chat_id=d['user'], text='Option already active!\nDisable it with /stopautoss command.')
                else:
                    db.update({'autoss': True}, q.user == d['user'])
                    bot.sendMessage(chat_id=d['user'], text='Option activated!\nYou will receive all new screenshots found!\n\nDisable it with /stopautoss command.')

def stopautoss(bot, update):
    if update.message.date > botstart:
        if update.message.chat_id in special_ids:    
            users = db.search(q.user == update.message.chat_id)
            if len(users) == 1:
                d = users[0]
                if d['autoss']:
                    db.update({'autoss': False}, q.user == d['user'])
                    bot.sendMessage(chat_id=d['user'], text='Option disabled!\nYou will not receive new screenshots found!\n\nActivate it with /startautoss command.')                    
                else:
                    bot.sendMessage(chat_id=d['user'], text='Option already disabled!\nActivate it with /startautoss command.')
                    

def error(bot, update, error):
    logger.warn('Update "%s" caused error "%s"' % (update, error))
    
    
def main():
    global job_queue
       
    # Create the EventHandler and pass it your bot's token.
    updater = Updater(token_bot)
    
    job_queue = updater.job_queue
    
    # Get the dispatcher to register handlers
    dp = updater.dispatcher

    # on different commands - answer in Telegram
    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CommandHandler("help", help))
    dp.add_handler(CommandHandler("sendss", sendss))
    dp.add_handler(CommandHandler("deletess", deletess))
    dp.add_handler(CommandHandler("startautoss", startautoss))
    dp.add_handler(CommandHandler("stopautoss", stopautoss))
    
    # log all errors
    dp.add_error_handler(error)

    # Start the Bot
    updater.start_polling(poll_interval=2)

    jobStartMsg = Job(job_sendStartMsg, 0, repeat=False)
    jobDeleteSs = Job(job_deletess, 43200)
    jobCheckss = Job(job_checkss, 5)
    job_queue.put(jobStartMsg)
    job_queue.put(jobDeleteSs)
    job_queue.put(jobCheckss)

    # Run the bot until the you presses Ctrl-C or the process receives SIGINT,
    # SIGTERM or SIGABRT. This should be used most of the time, since
    # start_polling() is non-blocking and will stop the bot gracefully.
    updater.idle()


if __name__ == '__main__':
    main()
