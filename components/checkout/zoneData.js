// Define delivery zones (replace with your real zone coordinates)
const deliveryZones = [
  {
    name: "Zone A",
    charge: 100,
    eta: "60-90 minutes",
    polygon: [
      [74.223474, 31.397936],
      [74.288619, 31.390499],
      [74.269779, 31.337772],
      [74.231241, 31.329341],
      [74.206866, 31.368374],
      [74.223474, 31.397936], // close loop
    ],
  },
  {
    name: "Zone A",
    charge: 150,
    eta: "90-105 minutes",
    polygon: [
      [74.223474, 31.397936],
      [74.206866, 31.368374],
      [74.231241, 31.329341],
      [74.203972, 31.303653],
      [74.187106, 31.366970],
      [74.223474, 31.397936], // close loop
    ],
  },
];

export default deliveryZones;
