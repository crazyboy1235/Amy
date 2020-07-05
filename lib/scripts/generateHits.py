#!/bin/python3

"""
Usage: generateHits -c hits -p proxylist

What do you think this does? The counter is there for a reason.
"""

import argparse
import requests
import sys
from bs4 import BeautifulSoup
from time import sleep
from random import choice

parser = argparse.ArgumentParser(description='Generate hits.')
parser.add_argument('-c', '--count', default=10)
parser.add_argument('-p', '--proxies')
parser.add_argument('-s', '--sleep', default=1)
args = parser.parse_args()

if args.proxies != None:
    with open(args.proxies) as proxyFile:
        proxies = proxyFile.readlines()


def getProxy():
    if args.proxies == None or len(proxies) == 0:
        return {}, 'no proxy'
    else:
        ip = choice(proxies)[:-2]
        return {'http': ip, 'https': ip}, ip.split(':')[0]


def doRequest():
    url = 'http://hits.dwyl.com/gideontong/Amy.svg'
    proxy, addr = getProxy()
    try:
        response = requests.request(
            'GET', url, headers={}, data={}, proxies=proxy)
        print('Got', BeautifulSoup(response.text.encode('utf8'),
                                   'html.parser').find(x='54').text, 'hits using', addr)
        sleep(int(args.sleep))
    except:
        print('Failed to connect to', addr)


for i in range(int(args.count)):
    doRequest()
