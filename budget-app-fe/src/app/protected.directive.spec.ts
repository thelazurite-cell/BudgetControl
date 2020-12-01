import { ProtectedDirective } from './authentication-manager/protected.directive';

describe('ProtectedDirective', () => {
  it('should create an instance', () => {
    const directive = new ProtectedDirective();
    expect(directive).toBeTruthy();
  });
});
