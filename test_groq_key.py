"""
Groq API Key & Model Tester
Usage: python test_groq_key.py YOUR_GROQ_API_KEY
Or run without arguments and it will prompt you to enter the key.
"""

import sys
import json
import urllib.request
import urllib.error

def test_key(api_key):
    api_key = api_key.strip()
    if not api_key:
        print("[!] No API key provided.")
        return

    print(f"[*] Testing Groq API key: {api_key[:8]}...{api_key[-4:] if len(api_key) > 12 else ''}")
    print("[*] Contacting Groq API (https://api.groq.com/openai/v1/models)...")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }

    # Step 1: Query models list
    models_url = "https://api.groq.com/openai/v1/models"
    req_models = urllib.request.Request(models_url, headers=headers, method="GET")

    available_models = []
    try:
        with urllib.request.urlopen(req_models, timeout=15) as res:
            models_data = json.loads(res.read().decode("utf-8"))
            for m in models_data.get("data", []):
                mid = m["id"]
                if "whisper" not in mid and "guard" not in mid:
                    available_models.append(mid)
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="ignore")
        print(f"\n[ERROR] Authentication failed (HTTP {e.code}): {err_body}")
        return
    except Exception as e:
        print(f"\n[ERROR] Failed to query models: {e}")
        return

    print(f"\n[SUCCESS] Authentication verified! Found {len(available_models)} chat/text models on your account:")
    for mid in available_models:
        print(f"  • {mid}")

    # Filter out non-chat models or models requiring special terms
    filtered_models = [m for m in available_models if "orpheus" not in m]

    preferred_order = [
        "qwen/qwen3.8-27b",
        "openai/gpt-oss-120b",
        "openai/gpt-oss-20b",
        "allam-2-7b"
    ]

    test_candidates = [p for p in preferred_order if p in filtered_models]
    for m in filtered_models:
        if m not in test_candidates:
            test_candidates.append(m)

    if not test_candidates:
        test_candidates = available_models

    chat_url = "https://api.groq.com/openai/v1/chat/completions"

    for chosen_model in test_candidates:
        print(f"\n[*] Testing chat completion with model: {chosen_model}")

        payload = {
            "model": chosen_model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are the AI assistant for Sahil Shaikh's portfolio. Confirm in one sentence that the key and model are active."
                },
                {
                    "role": "user",
                    "content": "Verify connection"
                }
            ],
            "max_tokens": 100,
            "temperature": 0.5
        }

        req_chat = urllib.request.Request(chat_url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")

        try:
            with urllib.request.urlopen(req_chat, timeout=15) as response:
                res_data = json.loads(response.read().decode("utf-8"))
                reply = res_data["choices"][0]["message"]["content"]
                print(f"\n[LIVE RESPONSE from {chosen_model}]:")
                print(f"> {reply}\n")
                print(f"[INFO] Success! Model '{chosen_model}' is fully operational on your key.")
                return
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="ignore")
            print(f"[!] Model {chosen_model} returned error ({e.code}): {err_body}")
            print("[*] Trying next available candidate model...")
            continue
        except Exception as e:
            print(f"[!] Exception testing {chosen_model}: {e}")
            continue

    print("\n[ERROR] None of the candidate models succeeded. Please verify your permissions on console.groq.com.")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        key = sys.argv[1]
    else:
        key = input("Enter your Groq API key (starts with gsk_): ")
    test_key(key)
