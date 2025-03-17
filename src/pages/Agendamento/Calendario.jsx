import React, { useState } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './components/Components-Calendario-css.css';

import eventosPadrao from './components/eventosPadrao';
import EventModal from './components/ModalEvent/EventModal';
import Adicionar from './components/adicionar/Adicionar';
import CustomToolbar from './components/CustomCalendar/CustomTollbar.jsx';
import FiltroAtividades from './components/filtro/FiltroAtividades.jsx';

moment.locale('pt-BR');

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

function Calendario() {
    const [eventos, setEventos] = useState(eventosPadrao);
    const [eventoSelecionado, setEventoSelecionado] = useState(null);
    const [eventosFiltrados, setEventosFiltrados] = useState(eventosPadrao);

    const eventStyle = (event) => ({
        style: {
            backgroundColor: event.color,
        },
    });

    const moverEventos = (data) => {
        const { start, end } = data;
        const updatedEvents = eventos.map((event) => {
            if (event.id === data.event.id) {
                return {
                    ...event,
                    start: new Date(start),
                    end: new Date(end),
                };
            }
            return event;
        });
        setEventos(updatedEvents);
    };

    const handleEventClick = (evento) => {
        setEventoSelecionado(evento);
    };

    const handleEventClose = () => {
        setEventoSelecionado(null);
    };

    const handleAdicionar = (novoEvento) => {
        setEventos([...eventos, { ...novoEvento, id: eventos.length + 1 }]);
    };

    const handleEventDelete = (eventId) => {
        const updatedEvents = eventos.filter((event) => event.id !== eventId);
        setEventos(updatedEvents);
        setEventoSelecionado(null);
    };

    const handleEventUpdate = (updatedEvent) => {
        const updatedEvents = eventos.map((event) => {
            if (event.id === updatedEvent.id) {
                return updatedEvent;
            }
            return event;
        });
        setEventos(updatedEvents);
        setEventoSelecionado(null);
    };

    const handleSelecionarAtividades = (atividadesSelecionadas) => {
        setEventosFiltrados(atividadesSelecionadas);
    };

    return (
        <div className='tela'>
            <div className='toolbar p-4' style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                <Adicionar onAdicionar={handleAdicionar} />
                <FiltroAtividades atividades={eventos} onSelecionarAtividades={handleSelecionarAtividades} />
            </div>

            <div className='calendario'>
                <DragAndDropCalendar
                    defaultDate={moment().toDate()}
                    defaultView='month'
                    events={eventosFiltrados}
                    localizer={localizer}
                    resizable
                    onEventDrop={moverEventos}
                    onEventResize={moverEventos}
                    onSelectEvent={handleEventClick}
                    eventPropGetter={eventStyle}
                    components={{
                        toolbar: CustomToolbar,
                    }}
                   // views={['Mês', 'Semana', 'Dia']}
                    className='calendar'
                />
            </div>
            {eventoSelecionado && (
                <EventModal evento={eventoSelecionado} onClose={handleEventClose} onDelete={handleEventDelete} onUpdate={handleEventUpdate} />
            )}
        </div>
    );
}

export default Calendario;