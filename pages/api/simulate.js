import blinder from 'color-blind';

export default function handler(req, res) {
  const { hexList, type } = req.query;

  let result = [];
  let hexArray = hexList.split(',');

  hexArray.forEach((hex) => {
    result.push(blinder[type](hex));
  });

  console.log(type, ':', result);

  res.status(200).json({ simulatedHexList: result });
}
