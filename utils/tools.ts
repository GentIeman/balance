export const getRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

export const calcProgress = (targetValue: number, totalValue: number) =>(targetValue / totalValue) * 100

export const checkSavingsPossibility = (salary: number, goalAmount: number) => {
    const monthsToReachGoal = goalAmount / salary
    let advice = ""

    switch (true) {
        case monthsToReachGoal > 12:
            advice = "You can reach your goal, but it may take several years. Consider increasing savings or reducing expenses."
            break

        case monthsToReachGoal <= 12 && monthsToReachGoal > 0:
            advice = "You can reach your goal within a year, but it's recommended to increase savings for an additional buffer."
            break

        default:
            advice = "Increase the savings amount to reach the set goal with your current salary."
            break
    }

    return advice
}