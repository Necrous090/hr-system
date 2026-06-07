const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const nombresMasculinos = ['Carlos','José','Ricardo','Fernando','Eduardo','Manuel','Roberto','Alberto','Jorge','Miguel','Antonio','Francisco','Alejandro','Daniel','Andrés','Héctor','Ramón','Luis','Ernesto','Gustavo','Raúl','Mario','Omar','Víctor','Pablo','Iván','Sergio','Felipe','Arturo','Orlando','Gilberto','Julio','Enrique','Mauricio','Rodrigo','Nelson','Rafael','Augusto','Reynaldo','Walther'];

const nombresFemeninos = ['María','Ana','Carmen','Rosa','Patricia','Isabel','Sandra','Laura','Diana','Claudia','Yolanda','Beatriz','Gloria','Martha','Elena','Silvia','Luz','Miriam','Dayra','Yeislin','Melisa','Giovanna','Mariela','Vanessa','Adriana','Karina','Lorena','Alicia','Norma','Esperanza','Zuleika','Marisol','Xiomara','Giselle','Yaritza','Karol','Yariela','Stephanie','Jennifer','Nayelis'];

const apellidos = ['Ríos','González','Martínez','Rodríguez','López','Hernández','Pérez','Sánchez','Ramírez','Torres','Flores','Díaz','Vega','Castro','Morales','Ortega','Jiménez','Rojas','Herrera','Medina','Vargas','Castillo','Ramos','Núñez','Araúz','Bethancourt','Batista','Dutari','Cárdenas','Tejada','Velásquez','Quintero','Pittí','Moreno','Salas','Espino','Aguilar','Fuentes','Mendoza','Reyes','Cruz','Villarreal','Chávez','Delgado','Gutiérrez','Solís','Murillo','Palma','Mena','Córdoba'];

const todosNombres = [...nombresMasculinos, ...nombresFemeninos];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generatePhone() {
  const prefix = random(['6614','6723','6831','6945','6512','6678','6390','6201','6345','6789']);
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${number}`;
}

function generateEmail(firstName, lastName, index) {
  const clean = (s) => s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '.');
  return `${clean(firstName)}.${clean(lastName)}${index}@empresa.com.pa`;
}

async function main() {
  console.log('🌱 Iniciando seed...');

  // Nuevos departamentos
  const newDepts = ['Legal', 'Marketing', 'Logística', 'Producción', 'Servicio al Cliente'];
  for (const name of newDepts) {
    await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  const departments = await prisma.department.findMany();
  console.log(`✅ ${departments.length} departamentos`);

  // Posiciones por departamento
  const tiposPosicion = [
    'Jefe de Departamento',
    'Supervisor',
    'Empleado',
    'Practicante',
    'Trainee',
    'Especialista'
  ];

  for (const dept of departments) {
    for (const tipo of tiposPosicion) {
      const title = `${tipo} - ${dept.name}`;
      const existing = await prisma.position.findFirst({ where: { title, departmentId: dept.id } });
      if (!existing) {
        await prisma.position.create({ data: { title, departmentId: dept.id } });
      }
    }
  }

  const positions = await prisma.position.findMany();
  console.log(`✅ ${positions.length} posiciones`);

  // Distribución de empleados por tipo
  const distribucion = {
    'Jefe de Departamento': 1,
    'Supervisor': 2,
    'Empleado': 18,
    'Practicante': 4,
    'Trainee': 3,
    'Especialista': 2
  };

  let employeeIndex = 100;
  let creados = 0;

  for (const dept of departments) {
    const deptPositions = positions.filter(p => p.departmentId === dept.id);

    for (const tipo of tiposPosicion) {
      const position = deptPositions.find(p => p.title.includes(tipo));
      if (!position) continue;

      const cantidad = distribucion[tipo];

      for (let i = 0; i < cantidad; i++) {
        const firstName = random(todosNombres);
        const lastName = `${random(apellidos)} ${random(apellidos)}`;
        const email = generateEmail(firstName, lastName, employeeIndex);
        const hireDate = randomDate(new Date('2015-01-01'), new Date('2024-12-31'));

        try {
          await prisma.employee.create({
            data: {
              firstName,
              lastName,
              email,
              phone: generatePhone(),
              hireDate,
              status: tipo === 'Practicante' ? 'ON_LEAVE' : 'ACTIVE',
              departmentId: dept.id,
              positionId: position.id
            }
          });
          creados++;
        } catch {
          // skip duplicates
        }

        employeeIndex++;
      }
    }
  }

  console.log(`✅ ${creados} empleados creados`);

  // Vacantes
  const vacantes = [
    { title: 'Desarrollador Backend Senior', description: 'Se requiere experiencia en Node.js y PostgreSQL', departmentId: departments.find(d => d.name === 'Tecnología')?.id },
    { title: 'Analista de Recursos Humanos', description: 'Experiencia en gestión de personal', departmentId: departments.find(d => d.name === 'Recursos Humanos')?.id },
    { title: 'Contador Senior', description: 'CPA con experiencia mínima de 5 años', departmentId: departments.find(d => d.name === 'Finanzas')?.id },
    { title: 'Supervisor de Operaciones', description: 'Liderazgo de equipos operativos', departmentId: departments.find(d => d.name === 'Operaciones')?.id },
    { title: 'Ejecutivo de Ventas', description: 'Captación y fidelización de clientes', departmentId: departments.find(d => d.name === 'Ventas')?.id },
    { title: 'Abogado Corporativo', description: 'Derecho mercantil y laboral', departmentId: departments.find(d => d.name === 'Legal')?.id },
    { title: 'Diseñador Gráfico', description: 'Manejo de Adobe Creative Suite', departmentId: departments.find(d => d.name === 'Marketing')?.id },
    { title: 'Coordinador de Logística', description: 'Gestión de cadena de suministro', departmentId: departments.find(d => d.name === 'Logística')?.id },
    { title: 'Técnico de Producción', description: 'Control de calidad y producción', departmentId: departments.find(d => d.name === 'Producción')?.id },
    { title: 'Agente de Servicio al Cliente', description: 'Atención al cliente presencial y virtual', departmentId: departments.find(d => d.name === 'Servicio al Cliente')?.id },
  ].filter(v => v.departmentId);

  const createdJobs = [];
  for (const vacante of vacantes) {
    const job = await prisma.jobOpening.create({
      data: {
        title: vacante.title,
        description: vacante.description,
        status: random(['OPEN', 'OPEN', 'OPEN', 'ON_HOLD'])
      }
    });
    createdJobs.push(job);
  }

  console.log(`✅ ${createdJobs.length} vacantes creadas`);

  // Candidatos
  const statusCandidatos = ['PENDING', 'REVIEWED', 'INTERVIEWED', 'HIRED', 'REJECTED'];
  let candidatosCreados = 0;

  for (const job of createdJobs) {
    const numCandidatos = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < numCandidatos; i++) {
      const firstName = random(todosNombres);
      const lastName = `${random(apellidos)} ${random(apellidos)}`;
      const email = generateEmail(firstName, lastName, employeeIndex + candidatosCreados);

      try {
        await prisma.candidate.create({
          data: {
            firstName,
            lastName,
            email,
            phone: generatePhone(),
            status: random(statusCandidatos),
            jobOpeningId: job.id
          }
        });
        candidatosCreados++;
      } catch {
        // skip
      }
    }
  }

  console.log(`✅ ${candidatosCreados} candidatos creados`);
  console.log('🎉 Seed completado!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());