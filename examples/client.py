import requests
from typing import Optional, Dict, Any, List

class AlightMotionAPI:
    def __init__(self, base_url: str, api_key: str, timeout: int = 30):
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        self.session.headers.update({
            "Content-Type": "application/json",
            "x-api-key": api_key.strip()
        })
        self.timeout = timeout

    def get_plans(self) -> List[Dict[str, str]]:
        r = self.session.get(f"{self.base_url}/api/plans", timeout=self.timeout)
        return r.json().get("data", [])

    def get_quota(self) -> Dict[str, Any]:
        return self.session.get(f"{self.base_url}/api/me", timeout=self.timeout).json()

    def send_verification_link(self, email: str) -> Dict[str, Any]:
        return self.session.post(
            f"{self.base_url}/api/auth/send-link",
            json={"email": email.strip()},
            timeout=self.timeout
        ).json()

    def upgrade_to_pro(self, email: str, link_or_oob: str, plan: str = "2_bulan") -> Dict[str, Any]:
        payload = {"email": email.strip(), "plan": plan}
        if link_or_oob.startswith("http"):
            payload["link"] = link_or_oob.strip()
        else:
            payload["oobCode"] = link_or_oob.strip()

        return self.session.post(
            f"{self.base_url}/api/subscription/upgrade",
            json=payload,
            timeout=self.timeout + 15
        ).json()
