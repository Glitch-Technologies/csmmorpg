from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import base62
from urllib.parse import urlparse
import os

hostName = "glitchtech.top"
serverPort = 7


def in_index(mylist, target):
    for i in mylist:
        if i == target:
            return True
    return False

def de(input_str):
    return base62.decodebytes(input_str).decode("utf-8")

def jwrite(file, out_json):
    outfile = open(file, "w")
    json.dump(out_json, outfile, indent=2)
    outfile.close()

def jload(file):
    jfile = open(file)
    jdict = json.load(jfile)
    jfile.close()
    return jdict

def get_query(query):
    keys = []
    values = []
    for qc in query.split("&"):
        pair = qc.split("=")
        keys.append(pair[0])
        values.append(pair[1])
    return dict(zip(keys, values))

class csServer(BaseHTTPRequestHandler):
    def do_GET(self):
        p = self.path.split("?")[0]
        # Refer to p[0] for get path
        query = urlparse(self.path).query
        query_components = {}
        if len(query) > 0:
            query_components = get_query(query)
        self.send_response(200)
        self.send_header("Content-type", "text/json")
        self.end_headers()

        if p == "/login":
            username = de(query_components["username"])
            password = de(query_components["password"])
            output = login(username, password)
            self.wfile.write(bytes(json.dumps(output), "utf-8"))

        if p == "/supersecret":
            self.wfile.write(bytes("Nice work me\n", "utf-8"))

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        # POST requests requiring decode should be put here
        decode = []
        if in_index(decode, self.path):
            query = post_data.decode("utf-8")
            query_components = {}
            if len(query) > 0:
                query_components = get_query(query)
        self.send_response(200)
        self.send_header("Content-type", "text/json")
        self.end_headers()
        if self.path == "/feature":
            self.wfile.write(bytes(json.dumps({"success": 1}), "utf-8"))


if __name__ == "__main__":
    webServer = HTTPServer((hostName, serverPort), csServer)
    print("Server started http://%s:%s" % (hostName, serverPort))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")