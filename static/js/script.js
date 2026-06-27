const examples = [
            {
                topic: "The Evolution of Blockchain Consensus Mechanisms",
                requirements: `- 2000-2500 words
- Compare Proof of Work, Proof of Stake, and newer mechanisms
- Discuss scalability and security trade-offs
- Include technical details on how each mechanism works
- Analyze energy consumption and environmental impact
- Target audience: Computer Science undergraduates`
            },
            {
                topic: "CRISPR-Cas9: Technical Mechanisms and Ethical Implications",
                requirements: `- 2000-2500 words
- Explain the molecular biology of CRISPR-Cas9
- Discuss precision and off-target effects
- Cover current applications in medicine and agriculture
- Address ethical concerns and regulatory frameworks
- Target audience: Biology/Bioengineering students`
            },
            {
                topic: "Transformer Architecture in Modern Natural Language Processing",
                requirements: `- 2000-2500 words
- Explain the attention mechanism in detail
- Discuss architecture components (encoders, decoders)
- Compare to previous RNN/LSTM approaches
- Cover modern applications (GPT, BERT, etc.)
- Include mathematical foundations where relevant
- Target audience: AI/ML students`
            },
            {
                topic: "Solid-State Battery Technology: Current Challenges and Future Prospects",
                requirements: `- 2000-2500 words
- Explain solid electrolyte materials and their properties
- Discuss advantages over lithium-ion batteries
- Cover current technical challenges (dendrite formation, interface resistance)
- Review recent research breakthroughs
- Analyze commercial viability timeline
- Target audience: Materials Science/Engineering students`
            },
            {
                topic: "Edge Computing vs Cloud Computing: Technical Trade-offs",
                requirements: `- 2000-2500 words
- Compare architectural differences
- Analyze latency, bandwidth, and processing considerations
- Discuss use cases for each approach
- Cover hybrid edge-cloud architectures
- Address security and privacy implications
- Target audience: Computer Engineering students`
            }
        ];

        let currentJobId = null;
        let pollInterval = null;

        function useExample(index) {
            document.getElementById('topicInput').value = examples[index].topic;
            document.getElementById('requirementsInput').value = examples[index].requirements;
        }

        async function startGeneration() {
            const topic = document.getElementById('topicInput').value.trim();
            const requirements = document.getElementById('requirementsInput').value.trim();
            
            if (!topic) {
                alert('Please enter an essay topic');
                return;
            }

            // Disable button
            const btn = document.getElementById('generateBtn');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner"></span> Researching & Writing...';

            // Show status section
            document.getElementById('statusSection').classList.add('active');
            
            // Reset UI
            resetUI();

            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ topic, requirements })
                });

                const data = await response.json();
                currentJobId = data.job_id;

                // Start polling for status
                pollStatus();

            } catch (error) {
                alert('Error: ' + error.message);
                btn.disabled = false;
                btn.innerHTML = '🚀 Generate Essay';
            }
        }

        function resetUI() {
            document.getElementById('logsContainer').innerHTML = '';
            document.getElementById('progressFill').style.width = '0%';
            document.getElementById('phaseName').textContent = 'Initializing...';
            document.getElementById('infoGrid').style.display = 'none';
            document.getElementById('researchCard').style.display = 'none';
            document.getElementById('structureCard').style.display = 'none';
            document.getElementById('scoresCard').style.display = 'none';
            document.getElementById('downloadSection').style.display = 'none';
            document.getElementById('essayPreview').style.display = 'none';
        }

        function pollStatus() {
            if (pollInterval) clearInterval(pollInterval);

            pollInterval = setInterval(async () => {
                try {
                    const response = await fetch(`/api/status/${currentJobId}`);
                    const data = await response.json();

                    updateUI(data);

                    if (data.status === 'completed' || data.status === 'error') {
                        clearInterval(pollInterval);
                        document.getElementById('generateBtn').disabled = false;
                        document.getElementById('generateBtn').innerHTML = '🚀 Generate Essay';
                        
                        if (data.status === 'completed') {
                            loadFullEssay();
                        }
                    }

                } catch (error) {
                    console.error('Polling error:', error);
                }
            }, 1000);
        }

        function updateUI(data) {
            // Update status badge
            const statusBadge = document.getElementById('statusBadge');
            statusBadge.className = `status-badge status-${data.status}`;
            statusBadge.textContent = data.status.toUpperCase();

            // Update phase
            if (data.current_phase) {
                document.getElementById('phaseName').textContent = data.current_phase;
            }

            // Update progress bar (estimate based on phase)
            let progress = 0;
            if (data.current_phase.includes('Planning')) progress = 15;
            else if (data.current_phase.includes('Research')) progress = 35;
            else if (data.current_phase.includes('Outline')) progress = 50;
            else if (data.current_phase.includes('Writing')) progress = 50 + (data.current_iteration * 10);
            else if (data.current_phase.includes('Review')) progress = 85;
            else if (data.current_phase.includes('Document')) progress = 95;
            else if (data.current_phase.includes('Complete')) progress = 100;
            
            document.getElementById('progressFill').style.width = `${progress}%`;

            // Update logs
            const logsContainer = document.getElementById('logsContainer');
            logsContainer.innerHTML = data.logs.map(log => 
                `<div class="log-entry">${log}</div>`
            ).join('');
            logsContainer.scrollTop = logsContainer.scrollHeight;

            // Update research tasks
            if (data.research_tasks && data.research_tasks.length > 0) {
                document.getElementById('infoGrid').style.display = 'grid';
                document.getElementById('researchCard').style.display = 'block';
                document.getElementById('researchTasks').innerHTML = data.research_tasks.map(task => 
                    `<div class="task-item">${task}</div>`
                ).join('');
            }

            // Update structure
            if (data.structure && data.structure.length > 0) {
                document.getElementById('infoGrid').style.display = 'grid';
                document.getElementById('structureCard').style.display = 'block';
                document.getElementById('structureList').innerHTML = data.structure.map(item => 
                    `<div class="structure-item">${item}</div>`
                ).join('');
            }

            // Update scores
            if (data.scores && Object.keys(data.scores).length > 0) {
                document.getElementById('scoresCard').style.display = 'block';
                const scoresHtml = Object.entries(data.scores).map(([key, value]) => {
                    const label = key.replace(/_/g, ' ');
                    return `
                        <div class="score-item">
                            <span class="score-value">${value}/10</span>
                            <div class="score-label">${label}</div>
                        </div>
                    `;
                }).join('');
                document.getElementById('scoresGrid').innerHTML = scoresHtml;
            }

            // Show download if complete
            if (data.has_file && data.status === 'completed') {
                document.getElementById('downloadSection').style.display = 'block';
                document.getElementById('downloadBtn').href = `/api/download/${currentJobId}`;
            }

            // Show preview
            if (data.essay_preview && data.status === 'completed') {
                document.getElementById('essayPreview').style.display = 'block';
                document.getElementById('essayText').textContent = data.essay_preview + '...';
            }
        }

        async function loadFullEssay() {
            try {
                const response = await fetch(`/api/essay/${currentJobId}`);
                const data = await response.json();
                
                // Store for modal
                window.fullEssayData = data.essay;
            } catch (error) {
                console.error('Error loading full essay:', error);
            }
        }

        function viewFullEssay() {
            if (window.fullEssayData) {
                document.getElementById('fullEssayText').textContent = window.fullEssayData;
                document.getElementById('essayModal').classList.add('active');
            }
        }

        function closeModal() {
            document.getElementById('essayModal').classList.remove('active');
        }

        function clearAll() {
            document.getElementById('topicInput').value = '';
            document.getElementById('requirementsInput').value = '';
            document.getElementById('statusSection').classList.remove('active');
            
            if (pollInterval) {
                clearInterval(pollInterval);
            }
        }

        // Close modal on outside click
        document.getElementById('essayModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });