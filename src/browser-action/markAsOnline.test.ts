import { markAsOnline } from '.';

describe('browser-action', () => {
  describe('markeAsOnline', () => {
    it('should works', () => {
      markAsOnline();
      expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: 'green' });
      expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: 'ON' });
    });
  });
});
