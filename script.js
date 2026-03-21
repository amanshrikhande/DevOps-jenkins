/**
 * Symbiosis Admission Registration — script.js
 * Form Validation & UI Interactions
 */

"use strict";

/* ── Helpers ──────────────────────────────────────────── */

/**
 * Show an error message for a field.
 * @param {string} fieldId  - ID of the input element
 * @param {string} errorId  - ID of the error <span>
 * @param {string} message  - Error text to display
 */
function showError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(errorId);
  if (field) {
    field.classList.remove("is-valid");
    field.classList.add("is-invalid");
  }
  if (errorEl) errorEl.textContent = message;
}

/**
 * Clear error state on a field.
 */
function clearError(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(errorId);
  if (field) {
    field.classList.remove("is-invalid");
    field.classList.add("is-valid");
  }
  if (errorEl) errorEl.textContent = "";
}

/**
 * Validate email format with a proper regex.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/**
 * Validate 10-digit numeric phone number.
 */
function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone.trim());
}

/* ── Password Strength Meter ─────────────────────────── */

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 6)  score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0–5
}

function updateStrengthMeter(password) {
  const pwStrength = document.getElementById("pwStrength");
  const strengthFill = document.getElementById("strengthFill");
  const strengthLabel = document.getElementById("strengthLabel");

  if (!password) {
    pwStrength.style.display = "none";
    return;
  }

  pwStrength.style.display = "flex";
  const score = getPasswordStrength(password);
  const levels = [
    { label: "Weak",   color: "#e74c3c", width: "20%" },
    { label: "Weak",   color: "#e74c3c", width: "30%" },
    { label: "Fair",   color: "#f39c12", width: "50%" },
    { label: "Good",   color: "#2ecc71", width: "70%" },
    { label: "Strong", color: "#27ae60", width: "90%" },
    { label: "Strong", color: "#27ae60", width: "100%" },
  ];
  const level = levels[score] || levels[0];
  strengthFill.style.width = level.width;
  strengthFill.style.backgroundColor = level.color;
  strengthLabel.textContent = level.label;
  strengthLabel.style.color = level.color;
}

/* ── Field Validators ────────────────────────────────── */

const validators = {
  name() {
    const v = document.getElementById("name").value.trim();
    if (!v)           { showError("name","nameError","Full name is required."); return false; }
    if (v.length < 2) { showError("name","nameError","Name must be at least 2 characters."); return false; }
    if (!/^[A-Za-z\s.'-]+$/.test(v)) { showError("name","nameError","Name contains invalid characters."); return false; }
    clearError("name","nameError"); return true;
  },
  email() {
    const v = document.getElementById("email").value.trim();
    if (!v)               { showError("email","emailError","Email address is required."); return false; }
    if (!isValidEmail(v)) { showError("email","emailError","Please enter a valid email address."); return false; }
    clearError("email","emailError"); return true;
  },
  phone() {
    const v = document.getElementById("phone").value.trim();
    if (!v)               { showError("phone","phoneError","Phone number is required."); return false; }
    if (!isValidPhone(v)) { showError("phone","phoneError","Enter a valid 10-digit Indian mobile number."); return false; }
    clearError("phone","phoneError"); return true;
  },
  password() {
    const v = document.getElementById("password").value;
    if (!v)          { showError("password","passwordError","Password is required."); return false; }
    if (v.length < 6){ showError("password","passwordError","Password must be at least 6 characters."); return false; }
    clearError("password","passwordError"); return true;
  },
  confirmPassword() {
    const pw  = document.getElementById("password").value;
    const cpw = document.getElementById("confirmPassword").value;
    if (!cpw)       { showError("confirmPassword","confirmPasswordError","Please confirm your password."); return false; }
    if (pw !== cpw) { showError("confirmPassword","confirmPasswordError","Passwords do not match."); return false; }
    clearError("confirmPassword","confirmPasswordError"); return true;
  },
  gender() {
    const selected = document.querySelector('input[name="gender"]:checked');
    const errorEl = document.getElementById("genderError");
    if (!selected) { errorEl.textContent = "Please select a gender."; return false; }
    errorEl.textContent = ""; return true;
  },
  dob() {
    const v = document.getElementById("dob").value;
    if (!v) { showError("dob","dobError","Date of birth is required."); return false; }
    const today = new Date();
    const birthDate = new Date(v);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    if (age < 15)  { showError("dob","dobError","Applicant must be at least 15 years old."); return false; }
    if (age > 60)  { showError("dob","dobError","Please enter a valid date of birth."); return false; }
    clearError("dob","dobError"); return true;
  },
  address() {
    const v = document.getElementById("address").value.trim();
    if (!v)           { showError("address","addressError","Residential address is required."); return false; }
    if (v.length < 10){ showError("address","addressError","Please enter a complete address (min. 10 chars)."); return false; }
    clearError("address","addressError"); return true;
  },
  course() {
    const v = document.getElementById("course").value;
    if (!v) { showError("course","courseError","Please select a course."); return false; }
    clearError("course","courseError"); return true;
  },
  city() {
    const v = document.getElementById("city").value;
    if (!v) { showError("city","cityError","Please select a campus city."); return false; }
    clearError("city","cityError"); return true;
  },
  terms() {
    const checked = document.getElementById("terms").checked;
    const errorEl = document.getElementById("termsError");
    if (!checked) { errorEl.textContent = "You must accept the terms to continue."; return false; }
    errorEl.textContent = ""; return true;
  }
};

/* ── Real-time Validation Listeners ─────────────────── */

function attachLiveValidation() {
  const liveFields = ["name","email","phone","password","confirmPassword","dob","address","course","city"];
  liveFields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("blur", () => validators[id] && validators[id]());
      el.addEventListener("input", () => {
        if (el.classList.contains("is-invalid")) validators[id] && validators[id]();
        if (id === "password") updateStrengthMeter(el.value);
      });
    }
  });

  // Gender live validation
  document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener("change", () => validators.gender());
  });

  // Terms live validation
  document.getElementById("terms").addEventListener("change", () => validators.terms());
}

/* ── Password Toggle ─────────────────────────────────── */

function attachPasswordToggles() {
  document.querySelectorAll(".toggle-pw").forEach(btn => {
    btn.addEventListener("click", function () {
      const targetId = this.dataset.target;
      const input = document.getElementById(targetId);
      if (!input) return;
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      // Update icon appearance (opacity trick)
      this.style.opacity = isHidden ? "0.5" : "1";
    });
  });
}

/* ── Form Submission ─────────────────────────────────── */

function handleSubmit(e) {
  e.preventDefault();

  // Run all validators; collect results
  const results = Object.values(validators).map(fn => fn());
  const allValid = results.every(Boolean);

  if (!allValid) {
    // Scroll to first invalid field
    const firstInvalid = document.querySelector(".is-invalid, .field-error:not(:empty)");
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  // ── Success ──
  const submitBtn = document.getElementById("submitBtn");
  const successMsg = document.getElementById("successMsg");

  submitBtn.disabled = true;
  submitBtn.style.opacity = "0.7";
  submitBtn.querySelector(".btn-text").textContent = "Submitting…";

  setTimeout(() => {
    submitBtn.style.display = "none";
    successMsg.style.display = "flex";
    successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 900);
}

/* ── Init ────────────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", function () {
  attachLiveValidation();
  attachPasswordToggles();
  document.getElementById("admissionForm").addEventListener("submit", handleSubmit);

  // Phone: only allow numeric input
  document.getElementById("phone").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);
  });
});
