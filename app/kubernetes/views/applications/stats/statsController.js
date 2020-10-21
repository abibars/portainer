import angular from 'angular';

class KubernetesApplicationStatsController {
  /* @ngInject */
  constructor($async, $state, $interval, Notifications, KubernetesApplicationService, ChartService) {
    this.$async = $async;
    this.$state = $state;
    this.$interval = $interval;
    this.Notifications = Notifications;
    this.KubernetesApplicationService = KubernetesApplicationService;
    this.ChartService = ChartService;

    this.onInit = this.onInit.bind(this);
    this.initCharts = this.initCharts.bind(this);
  }

  initCharts() {
    const cpuChartCtx = $('#cpuChart');
    const cpuChart = this.ChartService.CreateCPUChart(cpuChartCtx);
    this.cpuChart = cpuChart;

    const memoryChartCtx = $('#memoryChart');
    const memoryChart = this.ChartService.CreateMemoryChart(memoryChartCtx);
    this.memoryChart = memoryChart;
  }

  async onInit() {
    this.state = {
      autoRefresh: false,
      refreshRate: '5',
      viewReady: false,
    };

    const podName = this.$transition$.params().pod;
    const containerName = this.$transition$.params().container;
    const namespace = this.$transition$.params().namespace;
    const applicationName = this.$transition$.params().name;

    this.podName = podName;
    this.containerName = containerName;

    try {
      this.application = await this.KubernetesApplicationService.get(namespace, applicationName);
      this.initCharts();
    } catch (err) {
      this.Notifications.error('Failure', err, 'Unable to retrieve application stats');
    } finally {
      this.state.viewReady = true;
    }
  }

  $onInit() {
    return this.$async(this.onInit);
  }
}

export default KubernetesApplicationStatsController;
angular.module('portainer.kubernetes').controller('KubernetesApplicationStatsController', KubernetesApplicationStatsController);
