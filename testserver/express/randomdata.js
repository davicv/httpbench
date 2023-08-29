const DEFAULT_COUNT = 100;

const NAME_LIST = ['Afonso', 'Alice', 'Ana', 'Amanda', 'Ana', 'Arthur', 'Augusto', 'Bernardo', 'Carlos',
                   'Carolina', 'Cassia', 'Cecília', 'Cintia', 'Daniel', 'Davi', 'Debora', 'Fabio', 'Fatima',
                   'Gabriel', 'Gael', 'Heitor', 'Helena', 'Isabella', 'Jose', 'Julia', 'Laura', 'Lavinnye',
                   'Ligia', 'Livia', 'Liz', 'Maitê', 'Manuela', 'Maria', 'Mauro', 'Miguel', 'Miguel', 'Noah',
                   'Ravi', 'Ronasa', 'Sophia'];
const CAR_LIST = ['Chevrolet Onix', 'Hyundai HB20', 'Ford Ka (hatch)', 'Chevrolet Prisma', 'Toyota Corolla',
                  'Fiat Palio', 'Renault Sandero', 'Fiat Strada', 'Volkswagen Gol', 'Honda HR-V', 'Jeep Renegade',
                  'Hyundai HB20S', 'Volkswagen Fox', 'Fiat Toro', 'Volkswagen Up!', 'Toyota Etios (hatch)',
                  'Fiat Uno', 'Toyota Hilux', 'Volkswagen Saveiro', 'Fiat Siena / Grand Siena',
                  'Toyota Etios (sedã)', 'Fiat Mobi', 'Honda Fit', 'Ford EcoSport', 'Chevrolet S10',
                  'Volkswagen Voyage', 'Renault Duster', 'Ford Ka+ (sedã)', 'Renault Logan', 'Chevrolet Spin',
                  'Chevrolet Cobalt', 'Nissan Versa', 'Honda Civic', 'Nissan March', 'Ford New Fiesta (hatch)',
                  'Ford Ranger', 'Honda City', 'Chevrolet Montana', 'Renault Duster Oroch', 'Toyota SW4'];

function getRandomData(count) {
    const list = [];
    const maxNameId = NAME_LIST.length - 1;
    const maxCarId = CAR_LIST.length - 1;
    const num = !count || count < 1 ? DEFAULT_COUNT : count;

    for (let i = 0 ; i < num ; i++) {
        list.push({
            id: randInt(100000, 999999),
            name: NAME_LIST[randInt(0, maxNameId)],
            age: randInt(18, 100),
            car: CAR_LIST[randInt(0, maxCarId)]
        });
    }
    return list;
}

function randInt(min, max) {
    const dif = max - min + 1;
    const val = min + Math.random() * dif;
    return val | 0;
}

module.exports = getRandomData;
