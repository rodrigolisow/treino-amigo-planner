-- Update exercise images with more specific and technique-focused URLs
UPDATE public.exercicios_biblioteca SET imagem_url = CASE
  -- Peito
  WHEN nome = 'Supino com Barra' THEN 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Supino com Halteres' THEN 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Crucifixo no Cabo' THEN 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Flexão de Braço' THEN 'https://images.unsplash.com/photo-1559245750-604b77b0e46e?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Supino Inclinado' THEN 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop&crop=center'
  
  -- Costas
  WHEN nome = 'Remada Baixa' THEN 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Remada Curvada' THEN 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Puxada Alta' THEN 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Levantamento Terra' THEN 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Remada Unilateral' THEN 'https://images.unsplash.com/photo-1623600989906-6aae5aa131d4?w=400&h=300&fit=crop&crop=center'
  
  -- Pernas
  WHEN nome = 'Agachamento Livre' THEN 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Leg Press' THEN 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Afundo' THEN 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Stiff' THEN 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Elevação de Panturrilha' THEN 'https://images.unsplash.com/photo-1623600989906-6aae5aa131d4?w=400&h=300&fit=crop&crop=center'
  
  -- Glúteo
  WHEN nome = 'Hip Thrust' THEN 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Agachamento Sumô' THEN 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Elevação Pélvica' THEN 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Abdução no Cabo' THEN 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Afundo com Ênfase no Glúteo' THEN 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400&h=300&fit=crop&crop=center'
  
  -- Ombros
  WHEN nome = 'Desenvolvimento com Barra' THEN 'https://images.unsplash.com/photo-1583500178690-5b6532e8c3a9?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Elevação Lateral' THEN 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Elevação Frontal' THEN 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Remada Alta' THEN 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Desenvolvimento com Halteres' THEN 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop&crop=center'
  
  -- Braços
  WHEN nome = 'Rosca Direta' THEN 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Rosca Martelo' THEN 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Tríceps Testa' THEN 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Tríceps Corda' THEN 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Extensão de Braço' THEN 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop&crop=center'
  
  -- Core
  WHEN nome = 'Prancha Abdominal' THEN 'https://images.unsplash.com/photo-1559245750-604b77b0e46e?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Abdominal Infra' THEN 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Abdominal Supra' THEN 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Twist Russo' THEN 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400&h=300&fit=crop&crop=center'
  WHEN nome = 'Elevação de Pernas' THEN 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&h=300&fit=crop&crop=center'
  ELSE imagem_url
END;

-- Add a new column for detailed image descriptions to help with technique
ALTER TABLE public.exercicios_biblioteca ADD COLUMN IF NOT EXISTS imagem_descricao TEXT;

-- Update with detailed technique descriptions for each exercise
UPDATE public.exercicios_biblioteca SET imagem_descricao = CASE
  -- Peito
  WHEN nome = 'Supino com Barra' THEN 'Pessoa deitada no banco, segurando barra com pegada média, empurrando para cima. Mostrar: peito estufado, omoplatas retraídas, pés firmes no chão.'
  WHEN nome = 'Supino com Halteres' THEN 'Pessoa no banco com halteres, braços em movimento de abertura e fechamento. Destacar: amplitude completa, controle do movimento, estabilização do core.'
  WHEN nome = 'Crucifixo no Cabo' THEN 'Pessoa em pé entre cabos, movendo braços em arco. Mostrar: postura ereta, ligeira flexão dos cotovelos, contração peitoral.'
  WHEN nome = 'Flexão de Braço' THEN 'Pessoa em posição de prancha fazendo flexão. Destacar: corpo alinhado, mãos na largura dos ombros, descida controlada.'
  WHEN nome = 'Supino Inclinado' THEN 'Pessoa em banco inclinado 45°, empurrando peso. Mostrar: ângulo correto do banco, trajetória da barra, ativação peitoral superior.'
  
  -- Costas
  WHEN nome = 'Remada Baixa' THEN 'Pessoa sentada puxando cabo. Mostrar: coluna ereta, retração das escápulas, cotovelos próximos ao corpo.'
  WHEN nome = 'Remada Curvada' THEN 'Pessoa inclinada puxando barra. Destacar: coluna neutra, flexão do quadril, puxada em direção ao umbigo.'
  WHEN nome = 'Puxada Alta' THEN 'Pessoa sentada puxando barra de cima. Mostrar: pegada ampla, puxada até o peito, ativação do latíssimo.'
  WHEN nome = 'Levantamento Terra' THEN 'Pessoa levantando barra do chão. Destacar: coluna neutra, quadril para trás, barra próxima ao corpo.'
  WHEN nome = 'Remada Unilateral' THEN 'Pessoa apoiada no banco, puxando halter. Mostrar: apoio no banco, coluna alinhada, puxada até o quadril.'
  
  -- Pernas
  WHEN nome = 'Agachamento Livre' THEN 'Pessoa agachando com barra. Destacar: joelhos alinhados com pés, quadril para trás, peito erguido, profundidade adequada.'
  WHEN nome = 'Leg Press' THEN 'Pessoa na máquina pressionando plataforma. Mostrar: posicionamento dos pés, amplitude controlada, joelhos alinhados.'
  WHEN nome = 'Afundo' THEN 'Pessoa dando passo à frente e descendo. Destacar: joelho traseiro próximo ao chão, tronco ereto, peso distribuído.'
  WHEN nome = 'Stiff' THEN 'Pessoa descendo barra com pernas retas. Mostrar: flexão do quadril, coluna neutra, alongamento posterior da coxa.'
  WHEN nome = 'Elevação de Panturrilha' THEN 'Pessoa elevando-se na ponta dos pés. Destacar: amplitude completa, contração no topo, controle na descida.'
  
  -- Glúteo
  WHEN nome = 'Hip Thrust' THEN 'Pessoa com costas no banco, elevando quadril. Mostrar: ângulo de 90° no joelho, contração glútea máxima, barra sobre quadril.'
  WHEN nome = 'Agachamento Sumô' THEN 'Pessoa agachando com pés afastados. Destacar: pontas dos pés voltadas para fora, descida profunda, ativação glútea.'
  WHEN nome = 'Elevação Pélvica' THEN 'Pessoa deitada elevando quadril. Mostrar: contração glútea, ponte completa, manutenção da posição.'
  WHEN nome = 'Abdução no Cabo' THEN 'Pessoa afastando perna lateralmente. Destacar: movimento controlado, ativação glútea lateral, estabilização do tronco.'
  WHEN nome = 'Afundo com Ênfase no Glúteo' THEN 'Pessoa fazendo afundo com foco no glúteo. Mostrar: passo amplo, descida profunda, ativação glútea predominante.'
  
  -- Ombros
  WHEN nome = 'Desenvolvimento com Barra' THEN 'Pessoa empurrando barra acima da cabeça. Mostrar: trajetória vertical, core estável, amplitude completa.'
  WHEN nome = 'Elevação Lateral' THEN 'Pessoa elevando halteres lateralmente. Destacar: braços ligeiramente flexionados, elevação até altura dos ombros, controle excêntrico.'
  WHEN nome = 'Elevação Frontal' THEN 'Pessoa elevando peso à frente. Mostrar: movimento frontal controlado, elevação até altura dos ombros, core estabilizado.'
  WHEN nome = 'Remada Alta' THEN 'Pessoa puxando barra verticalmente. Destacar: cotovelos acima dos punhos, puxada até próximo ao queixo, ativação deltoide.'
  WHEN nome = 'Desenvolvimento com Halteres' THEN 'Pessoa empurrando halteres acima da cabeça. Mostrar: trajetória independente de cada braço, amplitude completa, estabilização.'
  
  -- Braços
  WHEN nome = 'Rosca Direta' THEN 'Pessoa flexionando braços com barra. Mostrar: cotovelos fixos, flexão completa, contração bicipital máxima.'
  WHEN nome = 'Rosca Martelo' THEN 'Pessoa flexionando com pegada neutra. Destacar: punhos em posição neutra, movimento controlado, ativação antebraço.'
  WHEN nome = 'Tríceps Testa' THEN 'Pessoa deitada flexionando antebraços. Mostrar: cotovelos fixos, movimento apenas dos antebraços, extensão completa.'
  WHEN nome = 'Tríceps Corda' THEN 'Pessoa puxando corda para baixo. Destacar: cotovelos fixos, abertura da corda no final, extensão tricipital completa.'
  WHEN nome = 'Extensão de Braço' THEN 'Pessoa estendendo braços acima da cabeça. Mostrar: movimento controlado, extensão completa, foco no tríceps.'
  
  -- Core
  WHEN nome = 'Prancha Abdominal' THEN 'Pessoa em posição de prancha. Mostrar: corpo alinhado, core contraído, apoio nos antebraços, glúteos ativos.'
  WHEN nome = 'Abdominal Infra' THEN 'Pessoa elevando pernas. Destacar: elevação controlada das pernas, contração abdominal inferior, coluna neutra.'
  WHEN nome = 'Abdominal Supra' THEN 'Pessoa elevando tronco. Mostrar: flexão da coluna, contração abdominal superior, mãos na nuca sem forçar pescoço.'
  WHEN nome = 'Twist Russo' THEN 'Pessoa girando tronco sentada. Destacar: rotação controlada, core ativo, pés elevados, movimento lateral.'
  WHEN nome = 'Elevação de Pernas' THEN 'Pessoa elevando pernas estendidas. Mostrar: pernas retas, elevação controlada, contração abdominal profunda.'
  ELSE imagem_descricao
END;