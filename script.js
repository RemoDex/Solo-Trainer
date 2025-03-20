// Carrega os treinos do localStorage ou inicializa um array vazio
const workouts = JSON.parse(localStorage.getItem('workouts')) || [];

// Função para adicionar um treino
function addWorkout(exercise, weight, reps, sets) {
    workouts.push({
        exercise,
        weight: parseInt(weight),
        reps: parseInt(reps),
        sets: parseInt(sets),
        date: new Date().toLocaleDateString() // Armazena a data do treino
    });
    localStorage.setItem('workouts', JSON.stringify(workouts)); // Salva no localStorage
}

// Função para atualizar a lista de treinos
function updateWorkoutList() {
    const workoutList = document.getElementById('workout-list');
    if (workoutList) {
        workoutList.innerHTML = ''; // Limpa a lista atual
        workouts.forEach(workout => {
            const card = document.createElement('div');
            card.className = 'workout-card'; // Adiciona a classe para o cartão

            card.innerHTML = `
                <h3>${workout.exercise}</h3>
                <p><strong>Peso:</strong> ${workout.weight} kg</p>
                <p><strong>Repetições:</strong> ${workout.reps}</p>
                <p><strong>Séries:</strong> ${workout.sets}</p>
                <p><strong>Data:</strong> ${workout.date}</p>
            `;

            workoutList.appendChild(card); // Adiciona o cartão à lista
        });
    }
}

// Função para atualizar a tabela de desempenho
function updatePerformanceTable() {
    const performanceBody = document.getElementById('performance-body');
    if (performanceBody) {
        performanceBody.innerHTML = ''; // Limpa a tabela atual
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toLocaleDateString();

        workouts.forEach(workout => {
            if (workout.date === yesterdayString) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${workout.exercise}</td>
                    <td>${workout.weight}kg</td>
                    <td>${workout.reps} repetições</td>
                    <td>${workout.sets} séries</td>
                `;
                performanceBody.appendChild(row);
            }
        });
    }
}

// Função para gerar relatórios
function generateReport() {
    const reportOutput = document.getElementById('report-output');
    if (reportOutput) {
        reportOutput.innerHTML = ''; // Limpa a saída do relatório
        const today = new Date().toLocaleDateString();
        const todaysWorkouts = workouts.filter(workout => workout.date === today);

        if (todaysWorkouts.length > 0) {
            const totalWeight = todaysWorkouts.reduce((acc, workout) => acc + workout.weight * workout.reps * workout.sets, 0);
            const totalReps = todaysWorkouts.reduce((acc, workout) => acc + workout.reps * workout.sets, 0);
            const averageWeight = totalWeight / todaysWorkouts.length;

            const report = document.createElement('div');
            report.className = 'report-card'; // Classe para estilizar o relatório
            report.innerHTML = `
                <h3>Relatório do dia ${today}</h3>
                <p><strong>Total de Treinos:</strong> ${todaysWorkouts.length}</p>
                <p><strong>Peso Total Levantado:</strong> ${totalWeight} kg</p>
                <p><strong>Total de Repetições:</strong> ${totalReps}</p>
                <p><strong>Peso Médio Levantado:</strong> ${averageWeight.toFixed(2)} kg</p>
            `;
            reportOutput.appendChild(report);

            // Adiciona cartões para cada treino
            todaysWorkouts.forEach(workout => {
                const workoutCard = document.createElement('div');
                workoutCard.className = 'workout-detail-card'; // Classe para o cartão de detalhes do treino
                workoutCard.innerHTML = `
                    <h4>${workout.exercise}</h4>
                    <p><strong>Peso:</strong> ${workout.weight} kg</p>
                    <p><strong>Repetições:</strong> ${workout.reps}</p>
                    <p><strong>Séries:</strong> ${workout.sets}</p>
                    <p><strong>Data:</strong> ${workout.date}</p>
                `;
                reportOutput.appendChild(workoutCard); // Adiciona o cartão à saída do relatório
            });
        } else {
            const noWorkoutsReport = document.createElement('p');
            noWorkoutsReport.textContent = 'Nenhum treino realizado hoje.';
            reportOutput.appendChild(noWorkoutsReport);
        }
    }
}

// Função para gerar relatório semanal com filtro de data
function generateWeeklyReport() {
    const reportOutput = document.getElementById('report-output');
    const startDate = new Date(document.getElementById('start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);
    
    if (reportOutput) {
        reportOutput.innerHTML = ''; // Limpa a saída do relatório
        const thisWeeksWorkouts = workouts.filter(workout => {
            const workoutDate = new Date(workout.date);
            return workoutDate >= startDate && workoutDate <= endDate;
        });

        if (thisWeeksWorkouts.length > 0) {
            const totalWeight = thisWeeksWorkouts.reduce((acc, workout) => acc + workout.weight * workout.reps * workout.sets, 0);
            const totalReps = thisWeeksWorkouts.reduce((acc, workout) => acc + workout.reps * workout.sets, 0);
            const averageWeight = totalWeight / thisWeeksWorkouts.length;

            const report = document.createElement('div');
            report.className = 'report-card'; // Classe para estilizar o relatório
            report.innerHTML = `
                <h3>Relatório Semanal (${startDate.toLocaleDateString()} a ${endDate.toLocaleDateString()})</h3>
                <p><strong>Total de Treinos:</strong> ${thisWeeksWorkouts.length}</p>
                <p><strong>Peso Total Levantado:</strong> ${totalWeight} kg</p>
                <p><strong>Total de Repetições:</strong> ${totalReps}</p>
                <p><strong>Peso Médio Levantado:</strong> ${averageWeight.toFixed(2)} kg</p>
            `;
            reportOutput.appendChild(report);

            thisWeeksWorkouts.forEach(workout => {
                const workoutReport = document.createElement('div');
                workoutReport.className = 'workout-detail-card'; // Classe para o cartão de detalhes do treino
                workoutReport.innerHTML = `
                    <h4>${workout.exercise}</h4>
                    <p><strong>Peso:</strong> ${workout.weight} kg</p>
                    <p><strong>Repetições:</strong> ${workout.reps}</p>
                    <p><strong>Séries:</strong> ${workout.sets}</p>
                    <p><strong>Data:</strong> ${workout.date}</p>
                `;
                reportOutput.appendChild(workoutReport); // Adiciona o cartão à saída do relatório
            });
        } else {
            const noWorkoutsReport = document.createElement('p');
            noWorkoutsReport.textContent = 'Nenhum treino realizado neste intervalo de datas.';
            reportOutput.appendChild(noWorkoutsReport);
        }
    }
}

// Função para obter os dias da semana atual
function getThisWeek() {
    const today = new Date();
    const thisWeek = [];

    for (let i = 0; i < 7; i++) {
        const day = new Date(today);
        day.setDate(day.getDate() - i);
        thisWeek.push(day.toLocaleDateString());
    }

    return thisWeek;
}

// Adiciona evento ao formulário de adicionar treino
if (document.getElementById('workout-form')) {
    document.getElementById('workout-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário
        const exercise = document.getElementById('exercise').value;
        const weight = document.getElementById('weight').value;
        const reps = document.getElementById('reps').value;
        const sets = document.getElementById('sets').value;

        addWorkout(exercise, weight, reps, sets); // Adiciona o treino
        document.getElementById('workout-form').reset(); // Limpa o formulário
    });
}

// Atualiza a lista de treinos na página de lista
updateWorkoutList();

// Atualiza a tabela de desempenho na página de desempenho
updatePerformanceTable();

// Gera relatórios na página de relatórios
if (document.getElementById('generate-report')) {
    document.getElementById('generate-report').addEventListener('click', generateReport);
}

if (document.getElementById('generate-weekly-report')) {
    document.getElementById('generate-weekly-report').addEventListener('click', generateWeeklyReport);
}

window.onload = function() {
    setTimeout(function() {
        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen) {
            splashScreen.style.opacity = '0'; // Diminui a opacidade
            setTimeout(function() {
                splashScreen.style.display = 'none'; // Remove a splash screen
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.style.display = 'block'; // Mostra o conteúdo principal
                    mainContent.style.opacity = '1'; // Torna o conteúdo visível
                }
            }, 500); // Tempo para a transição de opacidade
        }
    }, 3000); // Tempo que a splash screen ficará visível
};