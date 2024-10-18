export function openInIframe(url, title) {
  // Create an overlay container for the iframe
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  overlay.style.zIndex = "9999";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";

  // Create the iframe element
  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.style.width = "90%";
  iframe.style.height = "90%";
  iframe.style.border = "none";
  iframe.title = title;

  // Append the iframe to the overlay
  overlay.appendChild(iframe);

  // Add a close button
  const closeButton = document.createElement("button");
  closeButton.innerText = "Close";
  closeButton.style.position = "absolute";
  closeButton.style.top = "20px";
  closeButton.style.right = "20px";
  closeButton.style.padding = "10px 20px";
  closeButton.style.backgroundColor = "red";
  closeButton.style.color = "white";
  closeButton.style.border = "none";
  closeButton.style.cursor = "pointer";
  closeButton.style.fontSize = "16px";

  // Close the iframe popup when the button is clicked
  closeButton.onclick = function () {
    document.body.removeChild(overlay);
  };

  // Append the close button to the overlay
  overlay.appendChild(closeButton);

  // Append the overlay to the document body
  document.body.appendChild(overlay);
}
