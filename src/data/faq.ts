export interface FaqItem {
    question: string;
    answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
    {
        question: '¿Cuándo cambia el valor de la UF?',
        answer: 'El valor de la UF cambia todos los días. El Banco Central de Chile publica con anticipación la tabla mensual, calculada a partir de la variación del IPC del mes anterior.',
    },
    {
        question: '¿Cómo usar la calculadora UF a Peso?',
        answer: 'Ingresa el monto en UF o en pesos en el campo de la calculadora. La conversión es automática y usa el valor oficial del día. Puedes alternar la dirección con el botón central.',
    },
    {
        question: '¿Cómo convertir UF a pesos?',
        answer: 'Multiplica el monto en UF por el valor vigente de la UF del día. Por ejemplo, si la UF está en $41.000, 10 UF equivalen a $410.000. La calculadora de uf2clp.cl hace el cálculo automáticamente y también puedes revisar la tabla de ejemplos de esta página.',
    },
    {
        question: '¿Cuánto es 1 UF en pesos?',
        answer: '1 UF equivale al valor vigente publicado por el Banco Central de Chile para el día. Revisa el valor de hoy en la calculadora o en la tabla de conversión de UF a pesos de esta página.',
    },
    {
        question: '¿Quién publica el valor de la UF?',
        answer: 'El Banco Central de Chile calcula y publica el valor de la UF. Sitios como mindicador.cl replican esa serie y uf2clp.cl la usa para actualizar la calculadora.',
    },
    {
        question: '¿La UF cambia los fines de semana y feriados?',
        answer: 'Sí. El Banco Central publica el valor de la UF para todos los días del calendario, incluidos fines de semana y feriados, con la tabla mensual anticipada.',
    },
    {
        question: '¿Cuál es la diferencia entre UF y UTM?',
        answer: 'La UF se reajusta según el IPC y se usa en créditos, arriendos y seguros. La UTM también se reajusta con el IPC, pero se expresa en pesos y se usa para impuestos y multas.',
    },
    {
        question: '¿Cómo se calcula el valor de la UF?',
        answer: 'El Banco Central aplica la variación del IPC del mes anterior al valor de la UF. Por eso la UF protege el valor del dinero frente a la inflación.',
    },
    {
        question: '¿Qué pasa si la UF sube?',
        answer: 'Si tienes una deuda expresada en UF, el monto en pesos aumenta cuando la UF sube. Si tienes ahorros en UF, su valor en pesos también aumenta, protegiéndolos de la inflación.',
    },
    {
        question: '¿Puedo consultar el valor de la UF de otros años?',
        answer: 'Sí. En uf2clp.cl puedes revisar tablas diarias por año y también el valor publicado de la UF para mañana.',
    },
];
