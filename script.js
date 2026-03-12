class CountdownTimer {
    constructor() {
        this.timer = null;
        this.remainingTime = 0;
        this.totalTime = 0;
        this.isPaused = false;
        this.currentMode = 'target';

        this.initElements();
        this.initEventListeners();
    }

    initElements() {
        // 模式相关
        this.modeBtns = document.querySelectorAll('.mode-btn');
        this.targetMode = document.getElementById('target-mode');
        this.durationMode = document.getElementById('duration-mode');
        this.targetDateInput = document.getElementById('target-date');

        // 时长输入
        this.durationHours = document.getElementById('duration-hours');
        this.durationMinutes = document.getElementById('duration-minutes');
        this.durationSeconds = document.getElementById('duration-seconds');

        // 控制按钮
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');

        // 显示元素
        this.countdownDisplay = document.getElementById('countdown-display');
        this.daysElement = document.getElementById('days');
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.progressBar = document.getElementById('progress-bar');
        this.statusMessage = document.getElementById('status-message');
    }

    initEventListeners() {
        // 模式切换
        this.modeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchMode(btn.dataset.mode));
        });

        // 控制按钮
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    switchMode(mode) {
        if (this.timer && !confirm('切换模式将重置当前倒计时，确定继续吗？')) {
            return;
        }

        this.currentMode = mode;
        this.reset();

        // 更新按钮状态
        this.modeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // 切换输入区域
        this.targetMode.classList.toggle('active', mode === 'target');
        this.durationMode.classList.toggle('active', mode === 'duration');
    }

    start() {
        if (this.timer) {
            return;
        }

        const targetTime = this.getTargetTime();

        if (!targetTime) {
            this.showStatus('请设置有效的时间！', 'error');
            return;
        }

        const now = new Date().getTime();
        this.totalTime = targetTime - now;

        if (this.totalTime <= 0) {
            this.showStatus('目标时间必须是未来时间！', 'error');
            return;
        }

        this.remainingTime = this.totalTime;
        this.isPaused = false;

        this.updateButtons();
        this.hideStatus();
        this.tick(); // 立即执行一次
        this.timer = setInterval(() => this.tick(), 1000);
    }

    getTargetTime() {
        if (this.currentMode === 'target') {
            const targetDate = this.targetDateInput.value;
            if (!targetDate) return null;
            return new Date(targetDate).getTime();
        } else {
            const hours = parseInt(this.durationHours.value) || 0;
            const minutes = parseInt(this.durationMinutes.value) || 0;
            const seconds = parseInt(this.durationSeconds.value) || 0;

            if (hours === 0 && minutes === 0 && seconds === 0) {
                return null;
            }

            return new Date().getTime() + (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
        }
    }

    tick() {
        if (this.isPaused) return;

        const now = new Date().getTime();
        this.remainingTime = Math.max(0, this.totalTime - (now - (this.totalTime - this.remainingTime)));

        this.updateDisplay();
        this.updateProgress();

        if (this.remainingTime <= 0) {
            this.complete();
        }
    }

    updateDisplay() {
        const days = Math.floor(this.remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((this.remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((this.remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((this.remainingTime % (1000 * 60)) / 1000);

        this.updateTimeElement(this.daysElement, days);
        this.updateTimeElement(this.hoursElement, hours);
        this.updateTimeElement(this.minutesElement, minutes);
        this.updateTimeElement(this.secondsElement, seconds);
    }

    updateTimeElement(element, value) {
        const formattedValue = value.toString().padStart(2, '0');
        if (element.textContent !== formattedValue) {
            element.textContent = formattedValue;
            element.classList.add('updated');
            setTimeout(() => element.classList.remove('updated'), 300);
        }
    }

    updateProgress() {
        const percentage = ((this.totalTime - this.remainingTime) / this.totalTime) * 100;
        this.progressBar.style.width = `${percentage}%`;
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseBtn.textContent = this.isPaused ? '继续' : '暂停';
        this.showStatus(this.isPaused ? '倒计时已暂停' : '倒计时继续', 'info');
    }

    reset() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        this.remainingTime = 0;
        this.totalTime = 0;
        this.isPaused = false;

        this.updateTimeElement(this.daysElement, 0);
        this.updateTimeElement(this.hoursElement, 0);
        this.updateTimeElement(this.minutesElement, 0);
        this.updateTimeElement(this.secondsElement, 0);
        this.progressBar.style.width = '0%';
        this.hideStatus();
        this.updateButtons();

        if (this.currentMode === 'target') {
            this.targetDateInput.value = '';
        } else {
            this.durationHours.value = 0;
            this.durationMinutes.value = 0;
            this.durationSeconds.value = 0;
        }
    }

    complete() {
        clearInterval(this.timer);
        this.timer = null;

        this.updateButtons();
        this.showStatus('🎉 倒计时结束！', 'success');

        // 播放提示音
        this.playNotificationSound();

        // 震动设备（如果支持）
        if ('vibrate' in navigator) {
            navigator.vibrate([500, 200, 500]);
        }
    }

    playNotificationSound() {
        // 使用 Web Audio API 播放提示音
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('无法播放提示音:', error);
        }
    }

    updateButtons() {
        this.startBtn.disabled = !!this.timer;
        this.pauseBtn.disabled = !this.timer;
        this.pauseBtn.textContent = this.isPaused ? '继续' : '暂停';
    }

    showStatus(message, type) {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-message show ${type}`;
    }

    hideStatus() {
        this.statusMessage.classList.remove('show');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new CountdownTimer();
});
