-- Create exercicios_biblioteca table for exercise library
CREATE TABLE public.exercicios_biblioteca (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  categoria TEXT NOT NULL,
  imagem_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.exercicios_biblioteca ENABLE ROW LEVEL SECURITY;

-- Create policies - exercises are viewable by everyone
CREATE POLICY "Exercises are viewable by everyone" 
ON public.exercicios_biblioteca 
FOR SELECT 
USING (true);

-- Create treinos table for workouts
CREATE TABLE public.treinos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  data_agendada DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.treinos ENABLE ROW LEVEL SECURITY;

-- Create policies for treinos
CREATE POLICY "Users can view their own treinos" 
ON public.treinos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own treinos" 
ON public.treinos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own treinos" 
ON public.treinos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own treinos" 
ON public.treinos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create exercicios_treino table for workout exercises
CREATE TABLE public.exercicios_treino (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  treino_id UUID NOT NULL REFERENCES public.treinos(id) ON DELETE CASCADE,
  exercicio_id UUID NOT NULL REFERENCES public.exercicios_biblioteca(id),
  series INTEGER NOT NULL,
  repeticoes INTEGER NOT NULL,
  peso TEXT,
  com_isometria BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.exercicios_treino ENABLE ROW LEVEL SECURITY;

-- Create policies for exercicios_treino
CREATE POLICY "Users can view exercises from their own treinos" 
ON public.exercicios_treino 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.treinos 
  WHERE treinos.id = exercicios_treino.treino_id 
  AND treinos.user_id = auth.uid()
));

CREATE POLICY "Users can add exercises to their own treinos" 
ON public.exercicios_treino 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.treinos 
  WHERE treinos.id = exercicios_treino.treino_id 
  AND treinos.user_id = auth.uid()
));

CREATE POLICY "Users can update exercises from their own treinos" 
ON public.exercicios_treino 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.treinos 
  WHERE treinos.id = exercicios_treino.treino_id 
  AND treinos.user_id = auth.uid()
));

CREATE POLICY "Users can delete exercises from their own treinos" 
ON public.exercicios_treino 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.treinos 
  WHERE treinos.id = exercicios_treino.treino_id 
  AND treinos.user_id = auth.uid()
));

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_exercicios_biblioteca_updated_at
BEFORE UPDATE ON public.exercicios_biblioteca
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_treinos_updated_at
BEFORE UPDATE ON public.treinos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert exercise library data
INSERT INTO public.exercicios_biblioteca (nome, descricao, categoria, imagem_url) VALUES
-- Peito
('Supino com Barra', 'Deite no banco e empurre a barra para cima, mantendo controle total do movimento.', 'Peito', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),
('Supino com Halteres', 'Execute o movimento com halteres para maior amplitude de movimento e ativação muscular.', 'Peito', 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400'),
('Crucifixo no Cabo', 'Movimente os cabos em arco, focando no alongamento e contração do peitoral.', 'Peito', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),
('Flexão de Braço', 'Exercício corporal que trabalha peito, ombros e tríceps simultaneamente.', 'Peito', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),
('Supino Inclinado', 'Variação do supino que enfatiza a porção superior do peitoral.', 'Peito', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),

-- Costas
('Remada Baixa', 'Puxe o cabo em direção ao abdômen, contraindo as escápulas.', 'Costas', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400'),
('Remada Curvada', 'Incline o tronco e puxe a barra em direção ao peito baixo.', 'Costas', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400'),
('Puxada Alta', 'Puxe a barra por trás da cabeça ou pela frente, contraindo o latíssimo.', 'Costas', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400'),
('Levantamento Terra', 'Levante a barra do chão mantendo as costas retas e o core contraído.', 'Costas', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400'),
('Remada Unilateral', 'Execute o movimento com um halter, apoiando-se no banco.', 'Costas', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400'),

-- Pernas
('Agachamento Livre', 'Desça até os quadris ficarem abaixo dos joelhos, mantendo o peito erguido.', 'Pernas', 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=400'),
('Leg Press', 'Pressione a plataforma com os pés, controlando a descida e subida.', 'Pernas', 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=400'),
('Afundo', 'Dê um passo à frente e desça o joelho traseiro em direção ao chão.', 'Pernas', 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=400'),
('Stiff', 'Desça a barra mantendo as pernas retas, sentindo o alongamento posterior.', 'Pernas', 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=400'),
('Elevação de Panturrilha', 'Eleve-se na ponta dos pés, contraindo bem a panturrilha.', 'Pernas', 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=400'),

-- Glúteo
('Hip Thrust', 'Apoie as costas no banco e empurre o quadril para cima, contraindo o glúteo.', 'Glúteo', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400'),
('Agachamento Sumô', 'Posicione os pés mais afastados, com pontas voltadas para fora.', 'Glúteo', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400'),
('Elevação Pélvica', 'Deite e eleve o quadril, contraindo fortemente o glúteo.', 'Glúteo', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400'),
('Abdução no Cabo', 'Afaste a perna lateralmente contra a resistência do cabo.', 'Glúteo', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400'),
('Afundo com Ênfase no Glúteo', 'Execute o afundo focando na ativação do glúteo durante o movimento.', 'Glúteo', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400'),

-- Ombros
('Desenvolvimento com Barra', 'Pressione a barra acima da cabeça, mantendo o core estável.', 'Ombros', 'https://images.unsplash.com/photo-1583500178690-5b6532e8c3a9?w=400'),
('Elevação Lateral', 'Eleve os halteres lateralmente até a altura dos ombros.', 'Ombros', 'https://images.unsplash.com/photo-1583500178690-5b6532e8c3a9?w=400'),
('Elevação Frontal', 'Eleve o halter à frente do corpo até a altura dos ombros.', 'Ombros', 'https://images.unsplash.com/photo-1583500178690-5b6532e8c3a9?w=400'),
('Remada Alta', 'Puxe a barra verticalmente até próximo ao queixo.', 'Ombros', 'https://images.unsplash.com/photo-1583500178690-5b6532e8c3a9?w=400'),
('Desenvolvimento com Halteres', 'Execute o desenvolvimento com halteres para maior amplitude.', 'Ombros', 'https://images.unsplash.com/photo-1583500178690-5b6532e8c3a9?w=400'),

-- Braços
('Rosca Direta', 'Flexione os braços trazendo a barra em direção ao peito.', 'Braços', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400'),
('Rosca Martelo', 'Execute a rosca com pegada neutra, trabalhando bíceps e antebraços.', 'Braços', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400'),
('Tríceps Testa', 'Deite e flexione apenas os antebraços, mantendo os cotovelos fixos.', 'Braços', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400'),
('Tríceps Corda', 'Puxe a corda para baixo, abrindo-a no final do movimento.', 'Braços', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400'),
('Extensão de Braço', 'Estenda os braços acima da cabeça, focando no tríceps.', 'Braços', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400'),

-- Core
('Prancha Abdominal', 'Mantenha o corpo reto, contraindo abdômen e glúteos.', 'Core', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),
('Abdominal Infra', 'Eleve as pernas contraindo a porção inferior do abdômen.', 'Core', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),
('Abdominal Supra', 'Eleve o tronco contraindo a porção superior do abdômen.', 'Core', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),
('Twist Russo', 'Gire o tronco de um lado para o outro, mantendo os pés elevados.', 'Core', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),
('Elevação de Pernas', 'Eleve as pernas estendidas, contraindo o core.', 'Core', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400');