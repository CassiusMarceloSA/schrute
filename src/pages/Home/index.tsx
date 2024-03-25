import { useMemo } from 'react';
import { Equal, Plus } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import colors from 'tailwindcss/colors'
import 'chart.js/auto';
import { useFetchDataBySheet } from '@/hooks';

const pieColors = (isBorder: boolean = false) => {
    const tone = isBorder ? 700 : 600
    return [
        colors['orange'][tone],
        colors['indigo'][tone],
        colors['green'][tone],
        colors['blue'][tone],
        colors['red'][tone],
        colors['purple'][tone],
        colors['pink'][tone],
        colors['yellow'][tone],
        colors['lime'][tone],
        colors['cyan'][tone],

    ]
}



const formatCurrencyToBRL = (value: number) => Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    style: 'currency'
}).format(value)

const Home = () => {
    const { data, getCurrentExpensesSum, getReccurencyExpensesSum, getExpensesByCategory } = useFetchDataBySheet();

    const reccurencyExpensesSum = useMemo(() => getReccurencyExpensesSum(), [data]);
    const currentExpensesSum = useMemo(() => getCurrentExpensesSum(), [data]);
    const expensesByCategory = useMemo(() => getExpensesByCategory(), [data])

    const pieBackgroundColors = pieColors()
    const pieBorderColors = pieColors(true)

    pieBackgroundColors.length = expensesByCategory.length
    pieBorderColors.length = expensesByCategory.length

    console.log(expensesByCategory.reduce((acc, item) => acc + item.value, 0))

    return (
        <div className='bg-black p-2 h-screen w-screen color text-zinc-100 grid grid-cols-10 gap-3 grid-rows-12'>
            <nav className='bg-zinc-900 rounded-lg flex items-center justify-center col-start-1 col-end-4 row-start-1 row-end-10' >
                Aside Here (test deploy 3)
            </nav>
            <main className=' bg-zinc-800 overflow-hidden rounded-lg flex items-center justify-between col-start-4 col-end-13 row-start-1 row-end-10 ' >
                <div className='flex items-center justify-center w-full h-full' >
                    {/* <Pie
                        data={{
                            datasets: [
                                {
                                    data: [reccurencyExpensesSum, currentExpensesSum],
                                    label: 'R$',
                                }
                            ],
                            labels: ['Recorrentes', 'Atuais'],
                        }}
                    /> */}

                    <Pie
                        data={{
                            datasets: [
                                {
                                    data: expensesByCategory.sort((curr, next) => curr.value > next.value ? 1 : -1),
                                    label: 'R$',
                                    backgroundColor: pieBackgroundColors,
                                    borderColor: pieBorderColors,
                                }
                            ],
                            labels: expensesByCategory.map(item => item.category),
                        }}
                        options={{
                            plugins: {
                                legend: {
                                    align: 'start',
                                    position: 'left',
                                    maxHeight: 200,
                                    labels: { 
                                        color: colors.zinc[300],
                                    }
                                },
                            }
                        }}
                    />
                </div>
                <div className='flex justify-between w-1/2 h-full flex-col gap-1 border-l-4 border-black relative' >
                    <div className='h-full p-2 flex flex-col items-center justify-center' >
                        <p className='text-start text-zinc-100 text-lg' >
                            Despesas recorrentes
                        </p>
                        <p className='text-start font-light'>

                            {formatCurrencyToBRL(reccurencyExpensesSum)}
                        </p>
                    </div>
                    <div className='bg-black m-0 rounded-full w-full h-1 flex items-center justify-center '>
                        <div className='bg-black rounded-full' >
                            <Plus size={48} />
                        </div>
                    </div>

                    <div className='h-full p-2 flex flex-col items-center justify-center' >
                        <p className='text-start text-zinc-100 text-lg' >
                            Despesas do mes
                        </p>
                        <p className='text-start text-zinc-300 font-light'>
                            {formatCurrencyToBRL(currentExpensesSum)}
                        </p>
                    </div>
                    <div className='bg-black m-0 rounded-full w-full h-1 flex items-center justify-center '>
                        <div className='bg-black rounded-full' >
                            <Equal size={48} />
                        </div>
                    </div>
                    <div className='h-full m-2 p-2 rounded-lg flex flex-col items-center justify-center relative' >

                        <p className='text-start text-zinc-100 text-lg' >
                            Total das despesas
                        </p>
                        <p className='text-start text-zinc-300 font-light'>
                            {formatCurrencyToBRL(currentExpensesSum + reccurencyExpensesSum)}
                        </p>
                    </div>
                </div>
            </main>
            <footer className='rounded-lg flex items-center justify-center row-start-10 row-end-13 col-start-1 col-end-13' >Footer here</footer>
        </div>

    )
}

export default Home
