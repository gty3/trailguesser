
export default function ParseDMS(input: any) {
  var parts = input.split(/[^\d\w]+/);
  var lat = ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
  var lng = ConvertDMSToDD(parts[4], parts[5], parts[6], parts[7]);
  return { lat: lat, lng: lng }
}

function ConvertDMSToDD(degrees: any, minutes: any, seconds: any, direction: any) {
  var dd = degrees + minutes/60 + seconds/(60*60);

  if (direction == "S" || direction == "W") {
      dd = dd * -1;
  } // Don't do anything for N or E
  return dd;
}