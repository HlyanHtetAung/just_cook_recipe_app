export function handleWordLimit(toLimitWord, limitAmount) {
  if (toLimitWord.split("").length > limitAmount) {
    return toLimitWord.split("").splice(0, limitAmount).join("") + "...";
  }
  return toLimitWord;
}
