const form = document.querySelector('form');
		const tableBody = document.getElementById('#brewery-data');

		form.addEventListener('submit', async (event) => {
			event.preventDefault();

			const city = event.target.elements.city.value;
			const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_city=${city}&per_page=10`);

			if (response.ok) {
				const breweries = await response.json();

				tableBody.innerHTML = '';

				breweries.forEach((brewery) => {
					const row = document.createElement('tr');

					row.innerHTML = `
						<td>${brewery.name}</td>
						<td>${brewery.brewery_type}</td>
						<td>${brewery.street}, ${brewery.address_2 || ''}, ${brewery.address_3 || ''}</td>
						<td>${brewery.city}</td>
						<td>${brewery.state_province}</td>
						<td>${brewery.postal_code}</td>
						<td>${brewery.country}</td>
						<td>${brewery.phone || ''}</td>
						<td>${brewery.website_url || ''}</td>
					`;

					tableBody.appendChild(row);
				});
			}
		});