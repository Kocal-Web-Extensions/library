import { onNotificationClick } from '.';

describe('onNotificationClick', () => {
  it('should workd', () => {
    const cb = jest.fn();

    onNotificationClick(cb);
    expect(browser.notifications.onClicked.addListener).toHaveBeenLastCalledWith(cb);
  });
});
