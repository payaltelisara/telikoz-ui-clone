const BASE_URL = "https://telikoz.monagesalon.in";
const REDIRECT_URL = "https://telikozacademy.com/";

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

function openMap() {
  window.open("https://www.google.com/maps?q=13.1100259,80.2409052", "_blank", "noopener,noreferrer");
}

async function submitForm(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const submitBtn = document.getElementById("submitBtn");

  if (!name || !email || !phone) {
    Swal.fire({
      icon: "warning",
      title: "Missing Fields",
      text: "Please fill all fields"
    });
    return;
  }

  const csrfToken = getCsrfToken();
  if (!csrfToken) {
    Swal.fire({
      icon: "error",
      title: "Configuration Error",
      text: "Security token missing. Please refresh and try again."
    });
    return;
  }

  const utm = getUTMParams();

  submitBtn.disabled = true;

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

    window.location.href = REDIRECT_URL;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong. Please try again."
    });
  } finally {
    submitBtn.disabled = false;
  }
}

function init() {
  const form = document.getElementById("leadForm");
  const mapBtn = document.getElementById("mapBtn");

  if (form) {
    form.addEventListener("submit", submitForm);
  }

  if (mapBtn) {
    mapBtn.addEventListener("click", openMap);
  }
}

document.addEventListener("DOMContentLoaded", init);
