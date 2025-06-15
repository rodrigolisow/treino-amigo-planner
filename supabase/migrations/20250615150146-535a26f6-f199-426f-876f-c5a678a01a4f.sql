-- Add completion status to treinos table
ALTER TABLE public.treinos 
ADD COLUMN concluido BOOLEAN DEFAULT false,
ADD COLUMN data_conclusao TIMESTAMP WITH TIME ZONE;

-- Create index for better performance when filtering completed workouts
CREATE INDEX idx_treinos_concluido ON public.treinos(concluido);
CREATE INDEX idx_treinos_data_conclusao ON public.treinos(data_conclusao);