# README

I believe the submission is missing a few features (2.a.ii, 2.d.iii, and 4.a.i, hopefully not more...)

I didn't exactly understand 2.a.i and I was stuck for a while thinking I had to include a variable called
searchKey being a key of the passed in data that DOESN'T correspond to a nested object

Towards the end I think I've managed to get renderOption and customLabel working but I wasn't sure
how I'd handle filtering the list if it's not a list of strings (ie. string[])
I went back to play around with MUI Autocomplete and passing an array of objects instead of strings AND
without setting getOptionLabel results in an error (object not valid as ReactNode) so I went along with that

- not really acceptable though but I've ran out of time (recurring theme here)
  The component still doesn't work if I pass in an array of objects even with customLabel so...
  That said

## MOCK DATA

included mockData is an array of strings and that works just fine

mock2 is an array of objects and that still doesn't work and it should so that needs fixing

### I'd very much appreciate any feedback or advice on how I can improve my code. Thank you!
