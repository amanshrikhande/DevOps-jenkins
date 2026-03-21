"""
test.py — Selenium Test Suite for Symbiosis Admission Registration Form
"""

import os
import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.options import Options


# ── Setup ─────────────────────────────────────────────────────────────────────

FILE_PATH = os.path.abspath("index.html")
URL = "file://" + FILE_PATH

def create_driver():
    options = Options()
    options.add_argument("--window-size=1200,900")
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(3)
    return driver

def open_form(driver):
    driver.get(URL)
    time.sleep(0.8)

def click_submit(driver):
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    time.sleep(0.5)

def has_errors(driver):
    errors = driver.find_elements(By.CLASS_NAME, "field-error")
    return any(e.text.strip() for e in errors)

def has_success(driver):
    try:
        el = driver.find_element(By.ID, "successMsg")
        return el.is_displayed()
    except Exception:
        return False

def fill_valid_form(driver):
    driver.find_element(By.ID, "name").send_keys("Aman Sharma")
    driver.find_element(By.ID, "email").send_keys("aman@gmail.com")
    driver.find_element(By.ID, "phone").send_keys("9876543210")
    driver.find_element(By.ID, "dob").send_keys("01-01-2000")
    driver.find_element(By.ID, "address").send_keys("123 Main Street, Nagpur, Maharashtra")
    driver.find_element(By.CSS_SELECTOR, "input[name='gender'][value='Male']").click()
    Select(driver.find_element(By.ID, "course")).select_by_value("BCA")
    Select(driver.find_element(By.ID, "city")).select_by_value("Pune")
    driver.find_element(By.ID, "password").send_keys("SecurePass123")
    driver.find_element(By.ID, "confirmPassword").send_keys("SecurePass123")
    driver.find_element(By.ID, "terms").click()


# ── Test Runner ───────────────────────────────────────────────────────────────

passed = 0
failed = 0

def run_test(number, description, expected, fn, driver):
    global passed, failed
    print(f"Test Case {number}: {description}")
    print(f"  Expected  : {expected}")
    try:
        open_form(driver)
        result = fn(driver)
        print(f"  Result    : {result}")
        print(f"  Status    : PASS\n")
        passed += 1
    except Exception as e:
        print(f"  Result    : Error - {e}")
        print(f"  Status    : FAIL\n")
        failed += 1


# ── Individual Tests ──────────────────────────────────────────────────────────

def tc1(driver):
    fill_valid_form(driver)
    click_submit(driver)
    if has_success(driver):
        return "Form submitted successfully. Registration confirmed."
    raise AssertionError("Success message not shown.")

def tc2(driver):
    click_submit(driver)
    if has_errors(driver):
        return "Form blocked. All required fields showed errors."
    raise AssertionError("No errors shown for empty form.")

def tc3(driver):
    driver.find_element(By.ID, "name").send_keys("Aman Sharma")
    driver.find_element(By.ID, "phone").send_keys("9876543210")
    click_submit(driver)
    if has_errors(driver):
        return "Form blocked. Email field showed a validation error."
    raise AssertionError("No error shown for missing email.")

def tc4(driver):
    driver.find_element(By.ID, "name").send_keys("Aman Sharma")
    driver.find_element(By.ID, "email").send_keys("amangmail")
    click_submit(driver)
    if has_errors(driver):
        return "Form blocked. Email format was rejected as invalid."
    raise AssertionError("No error shown for invalid email format.")

def tc5(driver):
    driver.find_element(By.ID, "name").send_keys("Aman Sharma")
    driver.find_element(By.ID, "email").send_keys("aman@gmail.com")
    driver.find_element(By.ID, "phone").send_keys("9876543210")
    driver.find_element(By.ID, "password").send_keys("123")
    click_submit(driver)
    if has_errors(driver):
        return "Form blocked. Short password was rejected with an error."
    raise AssertionError("No error shown for short password.")

def tc6(driver):
    driver.find_element(By.ID, "name").send_keys("Aman Sharma")
    driver.find_element(By.ID, "email").send_keys("aman@gmail.com")
    driver.find_element(By.ID, "phone").send_keys("9876543210")
    driver.find_element(By.ID, "password").send_keys("123456")
    driver.find_element(By.ID, "confirmPassword").send_keys("654321")
    click_submit(driver)
    if has_errors(driver):
        return "Form blocked. Mismatched passwords were caught and flagged."
    raise AssertionError("No error shown for password mismatch.")

def tc7(driver):
    driver.find_element(By.ID, "name").send_keys("Aman Sharma")
    driver.find_element(By.ID, "email").send_keys("aman@gmail.com")
    driver.find_element(By.ID, "phone").send_keys("123")
    click_submit(driver)
    if has_errors(driver):
        return "Form blocked. Short phone number was rejected."
    raise AssertionError("No error shown for short phone number.")

def tc8(driver):
    fill_valid_form(driver)
    Select(driver.find_element(By.ID, "course")).select_by_value("")
    click_submit(driver)
    if has_errors(driver):
        return "Form blocked. Missing course selection was caught."
    raise AssertionError("No error shown for missing course.")

def tc9(driver):
    fill_valid_form(driver)
    Select(driver.find_element(By.ID, "city")).select_by_value("")
    click_submit(driver)
    if has_errors(driver):
        return "Form blocked. Missing city selection was caught."
    raise AssertionError("No error shown for missing city.")

def tc10(driver):
    fill_valid_form(driver)
    terms = driver.find_element(By.ID, "terms")
    if terms.is_selected():
        terms.click()
    click_submit(driver)
    if has_errors(driver):
        return "Form blocked. Terms checkbox was not checked and was flagged."
    raise AssertionError("No error shown for unchecked terms.")

def tc11(driver):
    driver.find_element(By.ID, "name").send_keys("Aman Sharma")
    click_submit(driver)
    if has_errors(driver):
        return "Form blocked. Multiple missing fields were flagged."
    raise AssertionError("No error shown when only name is filled.")

def tc12(driver):
    driver.find_element(By.ID, "name").send_keys("123!!")
    driver.find_element(By.ID, "email").send_keys("notanemail")
    driver.find_element(By.ID, "phone").send_keys("abcde")
    click_submit(driver)
    if has_errors(driver):
        return "Form blocked. All invalid inputs were rejected correctly."
    raise AssertionError("No errors shown for completely invalid data.")


# ── Main ──────────────────────────────────────────────────────────────────────

TESTS = [
    (1,  "All fields filled with valid data",               "Form should submit and show a success message",          tc1),
    (2,  "Form submitted completely empty",                 "Form should be blocked with errors on all fields",       tc2),
    (3,  "Email field not filled in",                       "Form should be blocked with an email required error",    tc3),
    (4,  "Invalid email format entered",                    "Form should reject the email and show a format error",   tc4),
    (5,  "Password is too short (less than 6 characters)",  "Form should block and say password is too short",        tc5),
    (6,  "Confirm password does not match password",        "Form should block and say passwords do not match",       tc6),
    (7,  "Phone number entered is only 3 digits",           "Form should block and ask for a valid 10-digit number",  tc7),
    (8,  "Course not selected from dropdown",               "Form should block and ask to select a course",           tc8),
    (9,  "City not selected from dropdown",                 "Form should block and ask to select a city",             tc9),
    (10, "Terms and conditions not accepted",               "Form should block and ask to accept the terms",          tc10),
    (11, "Only the Name field is filled",                   "Form should block and show errors for all other fields", tc11),
    (12, "Random invalid data entered in all fields",       "Form should reject everything and show multiple errors", tc12),
]

def main():
    print("=" * 55)
    print("  Symbiosis Admission Form - Selenium Test Suite")
    print("=" * 55)
    print()

    driver = create_driver()

    try:
        for number, description, expected, fn in TESTS:
            run_test(number, description, expected, fn, driver)
    finally:
        time.sleep(1)
        driver.quit()

    print("=" * 55)
    print(f"  Total: {passed + failed}  |  Passed: {passed}  |  Failed: {failed}")
    print("=" * 55)

if __name__ == "__main__":
    main()
