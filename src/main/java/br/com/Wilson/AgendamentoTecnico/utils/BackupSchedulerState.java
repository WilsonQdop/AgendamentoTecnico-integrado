package br.com.Wilson.AgendamentoTecnico.utils;

import br.com.Wilson.AgendamentoTecnico.model.enums.BackupFrequency;

import java.time.LocalDateTime;

public class BackupSchedulerState {

    private volatile boolean running = false;
    private Thread thread;
    private LocalDateTime nextExecution;
    private BackupFrequency frequency;

    public void stop() {
        this.running = false;
        if (thread != null) {
            thread.interrupt();
            thread = null;
        }
        this.nextExecution = null;
        this.frequency = null;
    }

    public boolean isRunning() { return running; }
    public void setRunning(boolean running) { this.running = running; }
    public Thread getThread() { return thread; }
    public void setThread(Thread thread) { this.thread = thread; }
    public LocalDateTime getNextExecution() { return nextExecution; }
    public void setNextExecution(LocalDateTime nextExecution) { this.nextExecution = nextExecution; }
    public BackupFrequency getFrequency() { return frequency; }
    public void setFrequency(BackupFrequency frequency) { this.frequency = frequency; }
}
