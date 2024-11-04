require('dotenv').config();
const Amadeus = require('amadeus');

const amadeus = new Amadeus({
  clientId: 'I1AnCAnJuDAFIpOcXegAmKLIFtu3mpGR',
  clientSecret: '109BH7AAwCllk7bl',
  logLevel: 'debug' // Detailed logging
});

const testFlightSearch = async () => {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: 'JFK',
      destinationLocationCode: 'LAX',
      departureDate: '2024-09-01',
      adults: '1'
    });
    console.log('Flight search response:', response.data);
  } catch (error) {
    console.error('Error fetching flight data:', error.response ? error.response.data : error.message);
  }
};

testFlightSearch();
