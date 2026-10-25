import { Component } from 'react';
import { SecondaryButton } from './ui/Buttons';

export default class PageLoadBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <section className="learn-refresh-card" role="alert">
      <h2>页面暂时无法加载</h2>
      <p>请检查网络后刷新重试。已保存的学习记录会保留。</p>
      <SecondaryButton onClick={() => window.location.reload()}>刷新重试</SecondaryButton>
    </section>;
  }
}
