document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout");
    const usageTable = document.getElementById("usage-table").querySelector("tbody");
    const addUsageForm = document.getElementById("add-usage-form");
    const applianceDropdown = document.getElementById("appliance");
    let appliancesData = []; // Store appliances data globally

    // Populate user data
    fetch("/dashboard/data")
        .then((response) => {
            if (!response.ok) throw new Error("No se pudieron cargar los datos");
            return response.json();
        })
        .then((data) => {
            console.log("Fetched data:", data); // Debug log
            document.getElementById("username").textContent = data.username;
            document.getElementById("total-monthly-usage").textContent = 
                data.totalMonthlyUsage.toFixed(2);

            // Store appliances data
            appliancesData = data.appliances;

            // Clear existing options
            applianceDropdown.innerHTML = '<option value="">Selecciona un electrodoméstico</option>';

            // Populate appliance dropdown
            appliancesData.forEach((appliance) => {
                const option = document.createElement("option");
                option.value = appliance.id;
                option.textContent = appliance.name;
                applianceDropdown.appendChild(option);
            });

            // Clear existing rows
            usageTable.innerHTML = '';

            // Populate usage instances
            data.usageInstances.forEach((instance) => addUsageRow(instance));
        })
        .catch((error) => {
            console.error("No se pudieron cargar los datos:", error);
            alert("No se pudieron cargar los datos del dashboard");
        });

    // Add appliance type label
    const frequencyLabel = document.querySelector('label[for="frequency"]');
    
    applianceDropdown.addEventListener('change', (e) => {
        const selectedAppliance = appliancesData.find(a => a.id == e.target.value);
        const frequencyHelp = document.getElementById('frequency-help');
        
        if (selectedAppliance) {
            const type = selectedAppliance.type === 'hours_per_day' 
                ? 'Horas por Día' 
                : 'Veces por Semana';
            frequencyLabel.textContent = `Frecuencia (${type}):`;
            frequencyHelp.textContent = `Ingrese ${type.toLowerCase()}`;
        } else {
            frequencyLabel.textContent = 'Frecuencia:';
            frequencyHelp.textContent = 'Selecciona un electrodoméstico para ver el tipo de frecuencia';
        }
    });

    // Add usage form submission
    addUsageForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const applianceId = document.getElementById("appliance").value;
        const frequency = document.getElementById("frequency").value;

        try {
            const response = await fetch("/dashboard/usage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    applianceId: parseInt(applianceId),
                    frequency: parseInt(frequency)
                }),
            });

            if (!response.ok) {
                throw new Error("Error al agregar uso");
            }

            const newUsage = await response.json();
            addUsageRow(newUsage);
            addUsageForm.reset();
        } catch (error) {
            console.error("Error:", error);
            alert("Error al agregar instancia de uso");
        }
    });

    // Update the addUsageRow function and add event listeners
    function addUsageRow(usage) {
        const row = document.createElement("tr");
        row.dataset.id = usage.id;
        const frequencyText = usage.type === 'hours_per_day' 
            ? `${usage.frequency} horas/día` 
            : `${usage.frequency} veces/semana`;
            
        row.innerHTML = `
            <td>${usage.applianceName}</td>
            <td class="frequency-cell">${frequencyText}</td>
            <td>${usage.monthlyUsage.toFixed(2)} kWh</td>
            <td>
                <button class="edit-btn" data-id="${usage.id}">Editar</button>
                <button class="delete-btn" data-id="${usage.id}">Eliminar</button>
            </td>
        `;

        // Add event listeners for edit and delete buttons
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');

        editBtn.addEventListener('click', () => handleEdit(row, usage));
        deleteBtn.addEventListener('click', () => handleDelete(row, usage.id));

        usageTable.appendChild(row);
    }

    function handleEdit(row, usage) {
        const frequencyCell = row.querySelector('.frequency-cell');
        const currentFreq = usage.frequency;
        
        frequencyCell.innerHTML = `
            <form class="edit-form">
                <input type="number" value="${currentFreq}" min="1" required>
                <button type="submit">Guardar</button>
                <button type="button" class="cancel">Cancelar</button>
            </form>
        `;

        const form = frequencyCell.querySelector('form');
        const cancelBtn = form.querySelector('.cancel');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newFrequency = parseInt(form.querySelector('input').value);
            
            try {
                const response = await fetch(`/dashboard/usage/${usage.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ frequency: newFrequency })
                });

                if (!response.ok) throw new Error('Update failed');
                
                const updatedUsage = await response.json();
                row.replaceWith(addUsageRow(updatedUsage));

                // Update total
                updateTotalUsage();
            } catch (error) {
                console.error('Error:', error);
                alert('No se pudo actualizar');
            }
        });

        cancelBtn.addEventListener('click', () => {
            const frequencyText = usage.type === 'hours_per_day' 
                ? `${usage.frequency} horas/día` 
                : `${usage.frequency} veces/semana`;
            frequencyCell.textContent = frequencyText;
        });
    }

    function handleDelete(row, id) {
        if (!confirm('¿Estás seguro que deseas eliminar esta instancia de uso?')) return;

        fetch(`/dashboard/usage/${id}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) throw new Error('Error al eliminar');
                row.remove();
                updateTotalUsage();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al eliminar la instancia de uso');
            });
    }

    async function updateTotalUsage() {
        try {
            const response = await fetch('/dashboard/data');
            const data = await response.json();
            document.getElementById('total-monthly-usage').textContent = 
                data.totalMonthlyUsage.toFixed(2);
        } catch (error) {
            console.error('Error al actualizar el total:', error);
        }
    }

    // Logout functionality
    logoutButton.addEventListener("click", () => {
        fetch("/logout", { method: "POST" })
            .then(() => (window.location.href = "/"));
    });
});
