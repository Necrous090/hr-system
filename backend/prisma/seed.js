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

  // Asistencia — últimos 30 días
  const empleados = await prisma.employee.findMany({ take: 100 });
  const statusAsistencia = ['PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'LATE', 'HALF_DAY'];
  let asistenciasCreadas = 0;

  for (const emp of empleados) {
    for (let d = 1; d <= 30; d++) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      try {
        await prisma.attendance.create({
          data: {
            employeeId: emp.id,
            date,
            status: random(statusAsistencia),
            notes: null
          }
        });
        asistenciasCreadas++;
      } catch { continue; }
    }
  }
  console.log(`✅ ${asistenciasCreadas} registros de asistencia`);

  // Vacaciones
  const empVac = await prisma.employee.findMany({ take: 60 });
  const statusVac = ['PENDING', 'APPROVED', 'APPROVED', 'REJECTED'];
  let vacCreadas = 0;

  for (const emp of empVac) {
    const start = randomDate(new Date('2024-01-01'), new Date('2025-06-01'));
    const end = new Date(start);
    end.setDate(end.getDate() + Math.floor(Math.random() * 14) + 5);
    try {
      await prisma.vacation.create({
        data: {
          employeeId: emp.id,
          startDate: start,
          endDate: end,
          status: random(statusVac),
          notes: 'Solicitud de vacaciones anuales'
        }
      });
      vacCreadas++;
    } catch { continue; }
  }
  console.log(`✅ ${vacCreadas} solicitudes de vacaciones`);

  // Capacitaciones
  const programas = [
    { name: 'Inducción Corporativa', description: 'Programa de bienvenida para nuevos empleados', days: 5 },
    { name: 'Seguridad Laboral', description: 'Normas y protocolos de seguridad en el trabajo', days: 3 },
    { name: 'Liderazgo y Gestión de Equipos', description: 'Desarrollo de habilidades gerenciales', days: 10 },
    { name: 'Excel Avanzado', description: 'Manejo avanzado de hojas de cálculo', days: 4 },
    { name: 'Atención al Cliente', description: 'Técnicas de servicio y fidelización', days: 6 },
    { name: 'Gestión de Proyectos', description: 'Metodologías ágiles y tradicionales', days: 8 },
    { name: 'Comunicación Efectiva', description: 'Habilidades de comunicación empresarial', days: 3 },
    { name: 'Normativas Laborales de Panamá', description: 'Código de trabajo y regulaciones locales', days: 4 },
  ];

  const empTraining = await prisma.employee.findMany({ take: 80 });

  for (const prog of programas) {
    const start = randomDate(new Date('2024-01-01'), new Date('2025-03-01'));
    const end = new Date(start);
    end.setDate(end.getDate() + prog.days);

    const training = await prisma.training.create({
      data: { name: prog.name, description: prog.description, startDate: start, endDate: end }
    });

    const participantes = empTraining.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 15) + 5);
    for (const emp of participantes) {
      try {
        await prisma.employeeTraining.create({
          data: {
            employeeId: emp.id,
            trainingId: training.id,
            completed: random([true, true, false]),
            score: Math.round(Math.random() * 4 + 6)
          }
        });
      } catch { continue; }
    }
  }
  console.log(`✅ ${programas.length} capacitaciones creadas`);

  // Evaluaciones de desempeño
  const empEval = await prisma.employee.findMany({ take: 120 });
  const periodos = ['Q1-2024', 'Q2-2024', 'Q3-2024', 'Q4-2024', 'Q1-2025'];
  const comentarios = [
    'Excelente desempeño y actitud positiva',
    'Cumple con los objetivos establecidos',
    'Necesita mejorar puntualidad',
    'Supera las expectativas del puesto',
    'Buen trabajo en equipo',
    'Requiere capacitación adicional',
    'Destaca en resolución de problemas',
    'Cumple satisfactoriamente sus funciones'
  ];

  let evalCreadas = 0;
  for (const emp of empEval) {
    const periodo = random(periodos);
    try {
      await prisma.performanceEvaluation.create({
        data: {
          employeeId: emp.id,
          score: Math.round((Math.random() * 4 + 6) * 10) / 10,
          period: periodo,
          comments: random(comentarios)
        }
      });
      evalCreadas++;
    } catch { continue; }
  }
  console.log(`✅ ${evalCreadas} evaluaciones creadas`);

  // Salida de personal
  const motivosSalida = [
    'Renuncia voluntaria',
    'Jubilación',
    'Fin de contrato',
    'Mutuo acuerdo',
    'Despido justificado'
  ];

  const empInactivos = await prisma.employee.findMany({ where: { status: 'ON_LEAVE' }, take: 15 });
  let salidasCreadas = 0;

  for (const emp of empInactivos) {
    try {
      await prisma.offboarding.create({
        data: {
          employeeId: emp.id,
          exitDate: randomDate(new Date('2024-01-01'), new Date('2025-01-01')),
          reason: random(motivosSalida),
          notes: 'Proceso completado conforme al código laboral de Panamá'
        }
      });
      await prisma.employee.update({
        where: { id: emp.id },
        data: { status: 'INACTIVE' }
      });
      salidasCreadas++;
    } catch { continue; }
  }
  console.log(`✅ ${salidasCreadas} registros de salida`);

  console.log(`✅ ${candidatosCreados} candidatos creados`);
  console.log('🎉 Seed completado!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());