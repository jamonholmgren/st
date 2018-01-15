import { GluegunCommand, GluegunRunContext } from 'gluegun';

interface Ship {
  name: string
  description: string
  maxPassengers: number
  maxCargo: number
  age: number
  speed: number
  maintenanceCost: number
  cost: number
}

interface Game {
  credits: number
  state: 'office' | 'shop' | 'hangar'
  availableShips: Ship[]
  ships: Ship[]
}

const game: Game = {
  credits: 1000,
  state: 'office',
  availableShips: [
    {
      name: 'Cordo ST-9',
      description: `In its heyday, the Cordo ST-9 was the pride of the fleet. These days, most ST-9s have been retired. Slow, low capacity, and expensive to maintain.`,
      maxPassengers: 8,
      maxCargo: 100,
      age: 28,
      speed: 10,
      maintenanceCost: 25,
      cost: 850
    },
    {
      name: 'Cordo ST-13',
      description: `The ST-13 is an improved version of the ST-9, but design flaws doomed it from the start. You can get a bargain, but be prepared for a headache.`,
      maxPassengers: 12,
      maxCargo: 150,
      age: 24,
      speed: 14,
      maintenanceCost: 35,
      cost: 950
    }
  ],
  ships: []
}

interface GameInput {
  main?: string
}

const t = {
  GO_TO_MIKES: `Go to Mike's Used Spaceships`,
  GO_TO_HANGAR: `Go to the hangar`,
  GO_TO_OFFICE: 'Go to your office',
  EXIT_GAME: 'Exit game'
}

module.exports = {
  run: async (context: GluegunRunContext) => {
    const { print, meta, prompt } = context
    const { colors } = print

    const printCredits = () => print.info(`You have ${colors.green(game.credits)} credits.`)

    context.cls()

    print.success(`Space Transport`)
    print.info('by Jamon Holmgren')
    print.info(`version ${meta.version()}`)
    print.info('')
    print.info('-----------------------')
    print.info('')
    print.info('You just started a small space transport company called, creatively, Space Transport, Inc..')
    print.info(`A bank has loaned you ${game.credits} credits toward buying your first space transport (ST).`)
    print.info('')
    print.info('Unfortunately, this is only enough to buy an ancient, rickety ST.')
    print.info('')
    print.info('Better than nothing, I suppose!')
    print.info('')

    let done = false

    while (!done) {
      let input: GameInput = { main: null }

      if (game.state === 'office') {
        print.info('')
        print.info(`You are at your office. Your desk is bare and your inbox is empty.`)
        print.info('')

        printCredits()

        input = await prompt.ask([{
          name: 'main',
          message: 'What would you like to do?',
          type: 'radio',
          choices: [
            t.GO_TO_MIKES,
            t.GO_TO_HANGAR,
            t.EXIT_GAME
          ]
        }])
      } else if (game.state === 'shop') {
        print.info('')
        print.info(`You are at Mike's Used Spaceships, a dimly lit and busy store. Mike, a small and`)
        print.info(`stressed-looking man, is busily working at a computer. He shouts over his shoulder,`)
        print.info(`"Let me know if you see something you like!" and keeps typing away furiously.`)
        print.info('')
        print.info(`A large screen with a crack running through it shows the available spaceships.`)
        const shipOptions = game.availableShips.map((s) => {
          print.info('')
          print.info(colors.magenta(`FOR SALE: ${s.name}`))
          print.info(`Cost: ${colors.green(s.cost)}`)
          print.info(`Maintenance Cost: ${colors.red(s.maintenanceCost)}`)
          print.info(`Age: ${colors.red(s.age)} Speed: ${colors.yellow(s.speed)} Max Passengers: ${colors.cyan(s.maxPassengers)} Max Cargo: ${colors.cyan(s.maxCargo)}`)
          print.info(colors.gray(`${s.description}`))
          return s.name
        })
        print.info('')

        printCredits()
        input = await prompt.ask([{
          name: 'main',
          message: 'Which would you like to purchase?',
          type: 'radio',
          choices: shipOptions.concat([t.GO_TO_OFFICE])
        }])

        if (shipOptions.includes(input.main)) {
          // buying a ship
          const buying = game.availableShips.find(s => s.name === input.main)

          if (game.credits >= buying.cost) {
            game.credits -= buying.cost
            game.ships = game.ships.concat([buying]) // add to my fleet
            game.availableShips = game.availableShips.filter(s => s.name !== buying.name) // remove from available
            print.success(`You are now the proud owner of a ${buying.age} year old ${buying.name}!`)
          } else {
            print.error(`You don't have enough money to buy the ${colors.magenta(buying.name)} for ${colors.green(buying.cost)}. You have ${colors.red(game.credits)}.`)
          }
        }
      } else {
        game.state = 'office'
      }

      if (input.main === t.EXIT_GAME) {
        const confirm = await prompt.confirm('Are you sure you want to exit? Y/N')
        if (confirm === true) done = true
      } else if (input.main === t.GO_TO_MIKES) {
        game.state = 'shop'
      } else if (input.main === t.GO_TO_HANGAR) {
        game.state = 'hangar'
      } else if (input.main === t.GO_TO_OFFICE) {
        game.state = 'office'
      }

      await context.sleep(2000)
    }
  }
} as GluegunCommand
