window.addEventListener("load", function(event) {
    // Завантаження даних через API і заповнення таблиці
    async function loadData() {
        const response = await fetch('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD');
        const data = await response.json();

        const tableBody = document.querySelector('#crypto-table tbody');

        data.Data.forEach((crypto, index) => {
            const row = document.createElement('tr');
            const url = 'https://raw.githubusercontent.com/rainner/binance-watch/master/public/images/icons/' + crypto.CoinInfo.Name.toLowerCase() + '_.png';

            const volume = crypto.DISPLAY.USD.VOLUME24HOUR;
            const trimmedVolume = volume.substring(volume.indexOf(' ') + 1);

            if (crypto.CoinInfo.Name === 'STETH') {
                row.innerHTML = `
            <td>${index + 1}. ${crypto.CoinInfo.FullName}</td>
            <td><img src='../img/steth.png'></td>
            <td>${crypto.CoinInfo.Name}</td>
            <td>${crypto.DISPLAY.USD.PRICE}</td>
            <td>${crypto.DISPLAY.USD.CHANGE24HOUR}</td>
            <td>${crypto.DISPLAY.USD.CHANGEPCT24HOUR}%</td>
            <td>${trimmedVolume}</td>
            <td>${crypto.DISPLAY.USD.MKTCAP}</td>
          `;
            }

            if (crypto.CoinInfo.Name === 'ARB') {
                row.innerHTML = `
            <td>${index + 1}. ${crypto.CoinInfo.FullName}</td>
            <td><img src='../img/arb.png'></td>
            <td>${crypto.CoinInfo.Name}</td>
            <td>${crypto.DISPLAY.USD.PRICE}</td>
            <td>${crypto.DISPLAY.USD.CHANGE24HOUR}</td>
            <td>${crypto.DISPLAY.USD.CHANGEPCT24HOUR}%</td>
            <td>${trimmedVolume}</td>
            <td>${crypto.DISPLAY.USD.MKTCAP}</td>
          `;
            }

            if (crypto.CoinInfo.Name === 'SOL') {
                row.innerHTML = `
            <td>${index + 1}. ${crypto.CoinInfo.FullName}</td>
            <td><img src='../img/sol.png'></td>
            <td>${crypto.CoinInfo.Name}</td>
            <td>${crypto.DISPLAY.USD.PRICE}</td>
            <td>${crypto.DISPLAY.USD.CHANGE24HOUR}</td>
            <td>${crypto.DISPLAY.USD.CHANGEPCT24HOUR}%</td>
            <td>${trimmedVolume}</td>
            <td>${crypto.DISPLAY.USD.MKTCAP}</td>
          `;
            }

            if (crypto.CoinInfo.Name === 'OKB') {
                row.innerHTML = `
          <td>${index + 1}. ${crypto.CoinInfo.FullName}</td>
          <td><img src='../img/okb.png'></td>
          <td>${crypto.CoinInfo.Name}</td>
          <td>${crypto.DISPLAY.USD.PRICE}</td>
          <td>${crypto.DISPLAY.USD.CHANGE24HOUR}</td>
          <td>${crypto.DISPLAY.USD.CHANGEPCT24HOUR}%</td>
          <td>${trimmedVolume}</td>
          <td>${crypto.DISPLAY.USD.MKTCAP}</td>
        `;
            }

            if (crypto.CoinInfo.Name !== 'STETH' && crypto.CoinInfo.Name !== 'ARB' && crypto.CoinInfo.Name !== 'SOL' && crypto.CoinInfo.Name !== 'OKB') {
                row.innerHTML = `
            <td>${index + 1}. ${crypto.CoinInfo.FullName}</td>
            <td><img src='${url}'></td>
            <td>${crypto.CoinInfo.Name}</td>
            <td>${crypto.DISPLAY.USD.PRICE}</td>
            <td>${crypto.DISPLAY.USD.CHANGE24HOUR}</td>
            <td>${crypto.DISPLAY.USD.CHANGEPCT24HOUR}%</td>
            <td>${trimmedVolume}</td>
            <td>${crypto.DISPLAY.USD.MKTCAP}</td>
          `;
            }

            tableBody.appendChild(row);
        });
    }
    loadData();
    console.log('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD');
});