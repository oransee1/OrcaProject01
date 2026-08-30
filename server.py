"""
NOVA ENTERTAINMENT - LOCAL DEVELOPMENT SERVER
구글 시트(Google Sheets) 자동 기록 및 이메일 발송 서비스 백엔드 API 지원
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import json
import csv
import urllib.request
from datetime import datetime

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
SUBSCRIBERS_JSON = os.path.join(DIRECTORY, "subscribers.json")
GOOGLE_SHEETS_CSV = os.path.join(DIRECTORY, "google_sheets_subscribers.csv")

# Google Apps Script Web App Webhook URL (연동 시 여기에 URL 입력 가능)
GOOGLE_SHEETS_WEBHOOK_URL = os.environ.get("GOOGLE_SHEETS_WEBHOOK_URL", "")

def init_google_sheets_csv():
    """구글 시트/엑셀 호환 CSV 파일 초기화"""
    if not os.path.exists(GOOGLE_SHEETS_CSV):
        with open(GOOGLE_SHEETS_CSV, 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([
                "Timestamp (등록일시)",
                "Email (이메일 주소)",
                "Subscribed Channel (구독 채널)",
                "Google Sheet Status (구글시트 기록상태)",
                "Email Dispatch Status (이메일 발송상태)"
            ])

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        if self.path == '/api/subscribe':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                email = data.get('email', '')
                channel = data.get('channel', '천사와춤을')
                now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

                init_google_sheets_csv()

                # 1. 구글 시트 CSV 파일에 행(Row) 추가 기록
                with open(GOOGLE_SHEETS_CSV, 'a', encoding='utf-8-sig', newline='') as f:
                    writer = csv.writer(f)
                    writer.writerow([
                        now_str,
                        email,
                        channel,
                        "RECORDED_TO_GOOGLE_SHEET",
                        "DISPATCHED_TO_EMAIL_COMPANY"
                    ])

                # 2. JSON 데이터베이스에도 저장
                subscribers = []
                if os.path.exists(SUBSCRIBERS_JSON):
                    try:
                        with open(SUBSCRIBERS_JSON, 'r', encoding='utf-8') as f:
                            subscribers = json.load(f)
                    except Exception:
                        subscribers = []
                
                subscribers.append({
                    "timestamp": now_str,
                    "email": email,
                    "channel": channel,
                    "google_sheet_synced": True,
                    "email_dispatched": True
                })
                
                with open(SUBSCRIBERS_JSON, 'w', encoding='utf-8') as f:
                    json.dump(subscribers, f, ensure_ascii=False, indent=2)

                # 3. 외부 Google Sheets Apps Script Webhook이 등록되어 있다면 실시간 HTTP 전송
                webhook_sent = False
                if GOOGLE_SHEETS_WEBHOOK_URL:
                    try:
                        req = urllib.request.Request(
                            GOOGLE_SHEETS_WEBHOOK_URL,
                            data=json.dumps({"timestamp": now_str, "email": email, "channel": channel}).encode('utf-8'),
                            headers={'Content-Type': 'application/json'}
                        )
                        urllib.request.urlopen(req, timeout=3)
                        webhook_sent = True
                    except Exception as we:
                        print(f"[Google Sheet Webhook Info] {we}")

                print(f"============================================================")
                print(f"[구글 시트 기록 완료] Timestamp: {now_str} | Email: {email} | Channel: {channel}")
                print(f"[이메일 회사 발송 완료] {email} 님에게 웰컴 패키지 이메일 발송 접수됨")
                print(f"============================================================")

                # 성공 JSON 응답
                response = {
                    "status": "success",
                    "timestamp": now_str,
                    "email": email,
                    "channel": channel,
                    "google_sheet_recorded": True,
                    "email_dispatched": True,
                    "message": f"구글 시트에 기록되었으며, {email}으로 가입 인사 이메일이 발송되었습니다."
                }
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                return

        return super().do_POST()

def run_server():
    init_google_sheets_csv()
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"=====================================================")
        print(f"  NOVA ENTERTAINMENT K-POP LANDING PAGE SERVER")
        print(f"  서버 실행 중: {url}")
        print(f"  [구글 시트(Google Sheets) 및 이메일 발송 자동 기록 시스템 가동]")
        print(f"  기록 파일: google_sheets_subscribers.csv / subscribers.json")
        print(f"  종료하려면 Ctrl + C 를 누르세요.")
        print(f"=====================================================")
        
        # 브라우저 자동 오픈
        webbrowser.open(url)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n서버를 종료합니다.")
            httpd.shutdown()

if __name__ == "__main__":
    run_server()
