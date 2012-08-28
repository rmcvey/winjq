import cgi

form = cgi.FieldStorage()

print form["testinput"]