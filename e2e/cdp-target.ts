import { type CDPSession } from '@playwright/test';

interface ITargetMessage {
  sessionId: string;
  message: string;
}

export async function evaluateInTarget<T>(
  session: CDPSession,
  urlEnding: string,
  expression: string
): Promise<T | undefined> {
  const { targetInfos } = await session.send('Target.getTargets');
  const target = targetInfos.find(info => info.url.endsWith(urlEnding));

  if (!target) {
    return undefined;
  }

  // Playwright exposes no page for a webview target, so the call goes through the parent session.
  const { sessionId } = await session.send('Target.attachToTarget', {
    targetId: target.targetId,
    flatten: false
  });

  return new Promise<T | undefined>(resolve => {
    const onMessage = (event: ITargetMessage) => {
      const reply = JSON.parse(event.message);

      if (event.sessionId === sessionId && reply.id === 1) {
        session.off('Target.receivedMessageFromTarget', onMessage);
        resolve(reply.result?.result?.value);
      }
    };

    session.on('Target.receivedMessageFromTarget', onMessage);
    session.send('Target.sendMessageToTarget', {
      sessionId,
      message: JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: { expression, returnByValue: true }
      })
    });
  });
}
