document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout");
    const usageTable = document.getElementById("usage-table").querySelector("tbody");
    const addUsageForm = document.getElementById("add-usage-form");

    // Populate user data
    fetch("/dashboard/data")
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("username").textContent = data.username;

            // Populate appliance dropdown
            const applianceDropdown = document.getElementById("appliance");
            data.appliances.forEach((appliance) => {
                const option = document.createElement("option");
                option.value = appliance.id;
                option.textContent = appliance.name;
                applianceDropdown.appendChild(option);
            });

            // Populate usage instances
            data.usageInstances.forEach((instance) => addUsageRow(instance));
        });

    // Add new usage instance
    addUsageForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const appliance = document.getElementById("appliance").value;
        const frequency = document.getElementById("frequency").value;

        fetch("/dashboard/add-instance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ appliance, frequency }),
        })
            .then((response) => response.json())
            .then((instance) => {
                addUsageRow(instance);
                addUsageForm.reset();
            });
    });

    // Helper to add a row to the table
    function addUsageRow(instance) {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${instance.applianceName}</td>
      <td>${instance.frequency}</td>
      <td>${instance.monthlyUsage.toFixed(2)}</td>
      <td>
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </td>
    `;
        usageTable.appendChild(row);
    }

    // Logout functionality
    logoutButton.addEventListener("click", () => {
        fetch("/logout", { method: "POST" })
            .then(() => (window.location.href = "/"));
    });
});
