import requests
import logging

# Setup logging to file and console
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(message)s',
    handlers=[logging.FileHandler("ServerTest.log", mode='w'), logging.StreamHandler()]
)

BASE_URL = "http://localhost:5039"
U1 = {"email": "owner@test.com", "password": "Password123!", "displayName": "Boss"}
U2 = {"email": "member@test.com", "password": "Password123!", "displayName": "Worker"}

def check(name, resp):
    status = f"OK ({resp.status_code})" if 200 <= resp.status_code < 300 else f"FAIL ({resp.status_code})"
    logging.info(f"{name.ljust(30)} | {status}")
    return resp

def run_tests():
    logging.info("--- Starting API Integration Test ---")

    # 1. Registration
    check("User 1 Registration", requests.post(f"{BASE_URL}/auth/register", json=U1))
    check("User 2 Registration", requests.post(f"{BASE_URL}/auth/register", json=U2))

    # 2. Login
    r1 = check("User 1 Login", requests.post(f"{BASE_URL}/auth/login", json=U1))
    r2 = check("User 2 Login", requests.post(f"{BASE_URL}/auth/login", json=U2))
    
    if r1.status_code != 200:
        logging.error("Failed to log in. Check if database exists and users were created.")
        return # Stop execution if login fails

    token1 = r1.json().get('token')
    token2 = r2.json().get('token')
    
    h1 = {"Authorization": f"Bearer {r1.json().get('token')}"}
    h2 = {"Authorization": f"Bearer {r2.json().get('token')}"}

    # 3. Create & Start Challenge
    c_req = {"title": "Dev Sprint", "visibility": 1, "startDate": "2026-01-01T00:00:00Z"}
    c_resp = check("Create Private Challenge", requests.post(f"{BASE_URL}/challenges", json=c_req, headers=h1))
    c_id = c_resp.json().get("id")
    
    check("Start Challenge", requests.post(f"{BASE_URL}/challenges/{c_id}:start", headers=h1))

    # 4. Membership (Join & Update)
    m_resp = check("Join Challenge (User 2)", requests.post(f"{BASE_URL}/memberships", json={"challengeId": c_id}, headers=h2))
    m_id = m_resp.json().get("id")
    
    check("Approve Membership (Owner)", requests.patch(f"{BASE_URL}/memberships/{m_id}", headers=h1))

    # 5. Progress Management
    p_req = {"amount": 10.5, "note": "Initial work", "loggedAt": "2026-04-26T10:00:00Z"}
    p_resp = check("Log Progress", requests.post(f"{BASE_URL}/progress-entries?challengeId={c_id}", json=p_req, headers=h2))
    p_id = p_resp.json().get("id")
    
    check("Update Progress (within 24h)", requests.patch(f"{BASE_URL}/progress-entries/{p_id}", json={"amount": 15.0}, headers=h2))

    # 6. Read Operations
    check("View Leaderboard", requests.get(f"{BASE_URL}/leaderboards/challenges/{c_id}"))
    check("Auth Me Check", requests.get(f"{BASE_URL}/auth/me", headers=h2))

    # 7. Delete Membership
    check("Leave Challenge", requests.delete(f"{BASE_URL}/memberships/{m_id}", headers=h2))

    logging.info("--- Test Suite Complete ---")

if __name__ == "__main__":
    try:
        run_tests()
    except Exception as e:
        logging.error(f"Execution Error: {e}")