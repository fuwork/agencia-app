import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/pt-br';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/Dialog';
import  Button  from '../components/ui/Button';
import  Input from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import  Card  from '../components/ui/Card';
import  CardContent  from '../components/ui/Card';
import { Calendar as CalendarIcon, Clock, Users, Video, Plus } from 'lucide-react';
import { useToast } from '../components/ui/Use-toast';

// Configuração do localizador para o calendário
moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const Agendamentos = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date(new Date().setHours(new Date().getHours() + 1)),
    description: '',
    participants: '',
    meetLink: ''
  });
  
  // Simula o carregamento de eventos da API do Google Calendar
  useEffect(() => {
    // Em uma implementação real, isso seria uma chamada à API do Google Calendar
    const mockEvents = [
      {
        id: 1,
        title: 'Reunião com Cliente A',
        start: new Date(2025, 2, 11, 10, 0), // 11 de março de 2025, 10:00
        end: new Date(2025, 2, 11, 11, 0),   // 11 de março de 2025, 11:00
        description: 'Discussão sobre novo projeto',
        participants: 'cliente@exemplo.com, equipe@fuwork.com',
        meetLink: 'https://meet.google.com/abc-defg-hij'
      },
      {
        id: 2,
        title: 'Revisão de Projeto B',
        start: new Date(2025, 2, 12, 14, 0), // 12 de março de 2025, 14:00
        end: new Date(2025, 2, 12, 15, 30),  // 12 de março de 2025, 15:30
        description: 'Revisão de progresso mensal',
        participants: 'gerente@exemplo.com, desenvolvedor@fuwork.com',
        meetLink: 'https://meet.google.com/xyz-uvwx-yz'
      }
    ];
    
    setEvents(mockEvents);
  }, []);
  
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setNewEvent({
      title: '',
      start: new Date(),
      end: new Date(new Date().setHours(new Date().getHours() + 1)),
      description: '',
      participants: '',
      meetLink: ''
    });
  };
  
  const handleAddEvent = () => {
    setSelectedEvent(null);
    setNewEvent({
      title: '',
      start: new Date(),
      end: new Date(new Date().setHours(new Date().getHours() + 1)),
      description: '',
      participants: '',
      meetLink: ''
    });
    setIsModalOpen(true);
  };
  
  const handleSaveEvent = () => {
    // Validações básicas
    if (!newEvent.title.trim()) {
      toast({
        title: "Erro",
        description: "O título da reunião é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    if (new Date(newEvent.end) <= new Date(newEvent.start)) {
      toast({
        title: "Erro",
        description: "A data/hora de término deve ser posterior à data/hora de início",
        variant: "destructive"
      });
      return;
    }

    // Em uma implementação real, aqui seria a integração com a API do Google Calendar
    // para criar o evento e o link do Google Meet
    
    // Gera um ID simulado para o novo evento
    const newEventWithId = {
      ...newEvent,
      id: Date.now(),
      // Em uma implementação real, o link do Meet seria gerado pela API do Google
      meetLink: newEvent.meetLink || `https://meet.google.com/${Math.random().toString(36).substring(2, 10)}`
    };
    
    // Adiciona o novo evento à lista de eventos
    setEvents([...events, newEventWithId]);
    
    toast({
      title: "Sucesso",
      description: "Reunião agendada com sucesso!",
      variant: "default"
    });
    
    handleCloseModal();
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value
    });
  };
  
  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: new Date(value)
    });
  };
  
  const generateMeetLink = () => {
    // Em uma implementação real, isso seria feito pela API do Google Meet
    const mockMeetLink = `https://meet.google.com/${Math.random().toString(36).substring(2, 10)}`;
    setNewEvent({
      ...newEvent,
      meetLink: mockMeetLink
    });
    
    toast({
      title: "Link do Google Meet",
      description: "Link gerado com sucesso!",
      variant: "default"
    });
  };
  
  // Função para formatar a data/hora para o formato do input datetime-local
  const formatDateTimeForInput = (date) => {
    return moment(date).format('YYYY-MM-DDTkk:mm');
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Agendamentos</h1>
        <Button onClick={handleAddEvent} className="flex items-center gap-2">
          <Plus size={16} />
          Agendar Nova Reunião
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            messages={{
              next: "Próximo",
              previous: "Anterior",
              today: "Hoje",
              month: "Mês",
              week: "Semana",
              day: "Dia",
              agenda: "Agenda",
              date: "Data",
              time: "Hora",
              event: "Evento",
              noEventsInRange: "Não há reuniões agendadas neste período."
            }}
            onSelectEvent={handleSelectEvent}
            views={['month', 'week', 'day', 'agenda']}
            popup
          />
        </CardContent>
      </Card>
      
      {/* Modal para visualizar/editar/criar evento */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? 'Detalhes da Reunião' : 'Agendar Nova Reunião'}
            </DialogTitle>
            <DialogDescription>nova reuniao</DialogDescription>
          </DialogHeader>
          
          {selectedEvent ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{selectedEvent.title}</h3>
              
              <div className="flex items-start gap-2">
                <CalendarIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="font-medium">Data e Horário</div>
                  <div>
                    {moment(selectedEvent.start).format('DD/MM/YYYY')} • 
                    {' '}{moment(selectedEvent.start).format('HH:mm')} - 
                    {' '}{moment(selectedEvent.end).format('HH:mm')}
                  </div>
                </div>
              </div>
              
              {selectedEvent.meetLink && (
                <div className="flex items-start gap-2">
                  <Video className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Link do Google Meet</div>
                    <a 
                      href={selectedEvent.meetLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedEvent.meetLink}
                    </a>
                  </div>
                </div>
              )}
              
              {selectedEvent.participants && (
                <div className="flex items-start gap-2">
                  <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Participantes</div>
                    <div>{selectedEvent.participants}</div>
                  </div>
                </div>
              )}
              
              {selectedEvent.description && (
                <div className="flex items-start gap-2">
                  <div className="whitespace-pre-wrap">{selectedEvent.description}</div>
                </div>
              )}
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCloseModal}>
                  Fechar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título da Reunião</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={newEvent.title} 
                  onChange={handleInputChange} 
                  placeholder="Ex: Reunião de Planejamento"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start">Data/Hora de Início</Label>
                  <Input 
                    id="start" 
                    name="start" 
                    type="datetime-local" 
                    value={formatDateTimeForInput(newEvent.start)} 
                    onChange={handleDateTimeChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="end">Data/Hora de Término</Label>
                  <Input 
                    id="end" 
                    name="end" 
                    type="datetime-local" 
                    value={formatDateTimeForInput(newEvent.end)} 
                    onChange={handleDateTimeChange} 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="participants">Participantes (e-mails separados por vírgula)</Label>
                <Input 
                  id="participants" 
                  name="participants" 
                  value={newEvent.participants} 
                  onChange={handleInputChange} 
                  placeholder="Ex: cliente@exemplo.com, equipe@fuwork.com"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={newEvent.description} 
                  onChange={handleInputChange} 
                  placeholder="Detalhes adicionais sobre a reunião"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="meetLink">Link do Google Meet</Label>
                <div className="flex gap-2">
                  <Input 
                    id="meetLink" 
                    name="meetLink" 
                    value={newEvent.meetLink} 
                    onChange={handleInputChange} 
                    placeholder="Link será gerado automaticamente se não fornecido"
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={generateMeetLink} type="button">
                    Gerar Link
                  </Button>
                </div>
              </div>
              
              <DialogFooter className="pt-4">
                <Button variant="outline" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveEvent}>
                  Agendar Reunião
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Agendamentos;