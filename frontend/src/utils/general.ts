function toCapital(text: string): string {
  return text[0].toUpperCase() + text.slice(1)
}

function thousandToK(number: number):string {
  return number >= 1000? parseFloat((number/1000).toFixed()) + "k": number.toString();
}

export { toCapital, thousandToK }