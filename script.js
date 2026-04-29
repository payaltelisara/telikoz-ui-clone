const BASE_URL = "https://telikoz.monagesalon.in";
const REDIRECT_URL = "https://telikozacademy.com/";
const FIELD_LABELS = {
  name: "Full Name",
  email: "Email Address",
  phone: "Phone Number"
};

function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || ""
  };
}

function getCsrfToken() {
  const tokenMeta = document.querySelector('meta[name="csrf-token"]');
  return tokenMeta ? tokenMeta.content : "";
}

function setFormStatus(message) {
  const status = document.getElementById("formStatus");
  if (status) {
    status.textContent = message;
  }
}

function setFieldError(fieldName, message) {
  const input = document.getElementById(fieldName);
  const errorEl = document.getElementById(`${fieldName}Error`);
  if (!input || !errorEl) {
    return;
  }

  errorEl.textContent = message || "";
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

function validateField(fieldName) {
  const input = document.getElementById(fieldName);
  if (!input) {
    return true;
  }

  const value = input.value.trim();
  let error = "";

  if (!value) {
    error = `${FIELD_LABELS[fieldName]} is required.`;
  } else if (fieldName === "name" && value.length < 2) {
    error = "Please enter at least 2 characters.";
  } else if (fieldName === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    error = "Please enter a valid email address.";
  } else if (fieldName === "phone" && value.replace(/\D/g, "").length < 10) {
    error = "Please enter a valid phone number.";
  }

  setFieldError(fieldName, error);
  return !error;
}

function validateForm() {
  const fields = ["name", "email", "phone"];
  let firstInvalid = null;
  let isValid = true;

  fields.forEach((field) => {
    const valid = validateField(field);
    if (!valid && !firstInvalid) {
      firstInvalid = document.getElementById(field);
      isValid = false;
    } else if (!valid) {
      isValid = false;
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
  }

  return isValid;
}

function setSubmitting(isSubmitting) {
  const submitBtn = document.getElementById("submitBtn");
  if (!submitBtn) {
    return;
  }

  submitBtn.disabled = isSubmitting;
  submitBtn.classList.toggle("is-loading", isSubmitting);
}

function openMap() {
  window.open("https://www.google.com/maps?q=13.1100259,80.2409052", "_blank", "noopener,noreferrer");
}

async function submitForm(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  if (!validateForm()) {
    setFormStatus("Please review and correct the highlighted fields.");
    return;
  }

  const csrfToken = getCsrfToken();
  if (!csrfToken) {
    Swal.fire({
      icon: "error",
      title: "Configuration Error",
      text: "Security token missing. Please refresh and try again."
    });
    setFormStatus("Security token missing. Please refresh and try again.");
    return;
  }

  const utm = getUTMParams();
  setSubmitting(true);
  setFormStatus("Submitting your application. Please wait.");

  Swal.fire({
    title: "Submitting...",
    text: "Please wait",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => Swal.showLoading()
  });

  try {
    const response = await fetch(`${BASE_URL}/lead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign
      })
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    await response.json().catch(() => ({}));

    if (typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: "AW-18021831173/meOCCPjwiIscEIWkvZFD",
        value: 1.0,
        currency: "INR"
      });
    }

    await Swal.fire({
      icon: "success",
      title: "Thank You!",
      text: "Our team will contact you shortly.",
      timer: 4000,
      showConfirmButton: false
    });

    setFormStatus("Application submitted successfully.");
    window.location.href = REDIRECT_URL;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong. Please try again or contact us directly."
    });
    setFormStatus("Submission failed. Please try again.");
  } finally {
    setSubmitting(false);
  }
}

function init() {
  const form = document.getElementById("leadForm");
  const mapBtn = document.getElementById("mapBtn");
  const fields = ["name", "email", "phone"];

  if (form) {
    form.addEventListener("submit", submitForm);
  }

  fields.forEach((field) => {
    const input = document.getElementById(field);
    if (!input) {
      return;
    }

    input.addEventListener("blur", () => validateField(field));
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") {
        validateField(field);
      }
    });
  });

  if (mapBtn) {
    mapBtn.addEventListener("click", openMap);
  }
}

document.addEventListener("DOMContentLoaded", init);
