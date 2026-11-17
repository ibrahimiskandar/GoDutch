# GoDutch

A simple web app for splitting shared expenses. Add people, record what each person spent, and see who pays whom so everything is even.

Features
Add and remove people
Record expenses for each person, in AZN or USD
Choose who shared each expense (people who didn't take part don't pay for it)
Switch the results between AZN and USD
Set your own exchange rate (default: 1 USD = 1.70 AZN)
Shows the fewest payments needed to settle up
Saves your data in the browser automatically
Works on phone and desktop, with light and dark mode
How to use
Open go-dutch.html in any browser. No install or server needed.
Type a name and click Add person. Repeat for everyone.
Under each person, enter the amount, pick the currency, add an optional note, and untick anyone who didn't share that expense. Click Add expense.
Read Who pays whom at the bottom.
How the split works
Every expense is converted to the currency you picked at the top, using the exchange rate you set.
Each expense is divided equally among the people ticked for it.
For each person: balance = what they paid − what they owe.
People with a negative balance pay people with a positive balance, using as few payments as possible.

Example: Ali pays 60 ₼ for dinner shared by Ali, Leyla and Murad, and Leyla pays 30 ₼ for a taxi shared by Ali and Leyla only. Ali owes 20 + 15 = 35 and paid 60, so he gets back 25. Leyla owes 20 + 15 = 35 and paid 30, so she owes 5. Murad owes 20. Result: Murad pays Ali 20 ₼, and Leyla pays Ali 5 ₼.

Good to know
Data is stored in your browser only (localStorage). It is not shared between devices, and clearing browser data removes it.
Removing a person also removes the expenses they entered.
Amounts are rounded to 2 decimals.
Everything lives in one file (go-dutch.html): HTML, CSS and JavaScript. No dependencies.
Customizing
More currencies: add them to the SYM object, to the currency <select> options, and to the view buttons in go-dutch.html. The conversion logic would also need to handle more than two currencies.
Unequal splits: not supported yet. Every expense is split equally among the people ticked for it.
